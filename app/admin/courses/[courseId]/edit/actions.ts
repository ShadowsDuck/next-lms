"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import prisma from "@/lib/db";
import {
  chapterSchema,
  ChapterSchemaType,
  courseSchema,
  CourseSchemaType,
  lessonSchema,
  LessonSchemaType,
} from "@/lib/schema";
import { ApiResponse } from "@/lib/types";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  }),
);

export async function editCourse(
  data: CourseSchemaType,
  courseId: string,
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many requests",
        };
      }

      if (decision.reason.isBot()) {
        return {
          status: "error",
          message: "You are a bot! if this is a mistake contact our support",
        };
      }
    }

    const result = courseSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid course data",
      };
    }

    await prisma.course.update({
      where: {
        id: courseId,
        userId: session.user.id,
      },
      data: {
        ...result.data,
      },
    });

    return {
      status: "success",
      message: "Course updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update course",
    };
  }
}

export async function reorderLessons(
  chapterId: string,
  lesson: { id: string; position: number }[],
  courseId: string,
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    if (!lesson || lesson.length === 0) {
      return {
        status: "error",
        message: "no lessons provided for reordering",
      };
    }

    const updates = lesson.map((lesson) =>
      prisma.lesson.update({
        where: {
          id: lesson.id,
          chapterId: chapterId,
        },
        data: {
          position: lesson.position,
        },
      }),
    );

    // run all updates in one command, if one fails, all will fail
    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder lessons",
    };
  }
}

export async function reorderChapters(
  courseId: string,
  chapter: { id: string; position: number }[],
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    if (!chapter || chapter.length === 0) {
      return {
        status: "error",
        message: "No chapters provided for reordering",
      };
    }

    const updates = chapter.map((chapter) =>
      prisma.chapter.update({
        where: {
          id: chapter.id,
          courseId: courseId,
        },
        data: {
          position: chapter.position,
        },
      }),
    );

    // run all updates in one command, if one fails, all will fail
    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapters reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder chapters",
    };
  }
}

export async function createChapter(
  data: ChapterSchemaType,
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = chapterSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid chapter data",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Find last chapter position
      const lastPosition = await tx.chapter.findFirst({
        where: {
          courseId: result.data.courseId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.chapter.create({
        data: {
          title: result.data.name,
          courseId: result.data.courseId,
          position: (lastPosition?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Chapter created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create chapter",
    };
  }
}

export async function deleteChapter(
  chapterId: string,
  courseId: string,
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const chapterToDelete = await tx.chapter.findUnique({
        where: {
          id: chapterId,
          courseId: courseId,
        },
        select: {
          id: true,
          position: true,
        },
      });

      if (!chapterToDelete) {
        return {
          status: "error",
          message: "Chapter not found",
        };
      }

      await tx.chapter.delete({
        where: {
          id: chapterId,
          courseId: courseId,
        },
      });

      await tx.chapter.updateMany({
        where: {
          courseId: courseId,
          position: {
            gt: chapterToDelete.position,
          },
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      });
    });

    if (result?.status === "error") {
      return {
        status: result.status,
        message: result.message,
      };
    }

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete chapter",
    };
  }
}

export async function createLesson(
  data: LessonSchemaType,
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = lessonSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid lesson data",
      };
    }

    await prisma.$transaction(async (tx) => {
      // Find last lesson position
      const lastPosition = await tx.lesson.findFirst({
        where: {
          chapterId: result.data.chapterId,
        },
        select: {
          position: true,
        },
        orderBy: {
          position: "desc",
        },
      });

      await tx.lesson.create({
        data: {
          title: result.data.name,
          chapterId: result.data.chapterId,
          description: result.data.description,
          thumbnailKey: result.data.thumbnailKey,
          videoKey: result.data.videoKey,
          position: (lastPosition?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.data.courseId}/edit`);

    return {
      status: "success",
      message: "Lesson created successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to create lesson",
    };
  }
}

export async function deleteLesson(
  lessonId: string,
  chapterId: string,
  courseId: string,
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = await prisma.$transaction(async (tx) => {
      const lessonToDelete = await tx.lesson.findUnique({
        where: {
          id: lessonId,
          chapterId: chapterId,
        },
        select: {
          id: true,
          position: true,
        },
      });

      if (!lessonToDelete) {
        return {
          status: "error",
          message: "Lesson not found",
        };
      }

      await tx.lesson.delete({
        where: {
          id: lessonId,
          chapterId: chapterId,
        },
      });

      await tx.lesson.updateMany({
        where: {
          chapterId: chapterId,
          position: {
            gt: lessonToDelete.position,
          },
        },
        data: {
          position: {
            decrement: 1,
          },
        },
      });
    });

    if (result?.status === "error") {
      return {
        status: result.status,
        message: result.message,
      };
    }

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete lesson",
    };
  }
}
