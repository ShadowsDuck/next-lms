"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import prisma from "@/lib/db";
import { lessonSchema, LessonSchemaType } from "@/lib/schema";
import { ApiResponse } from "@/lib/types";

export async function updateLesson(
  data: LessonSchemaType,
  lessonId: string,
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const result = lessonSchema.safeParse(data);

    if (!result.success) {
      return {
        status: "error",
        message: "Invalid data",
      };
    }

    await prisma.lesson.update({
      where: {
        id: lessonId,
      },
      data: {
        title: result.data.name,
        description: result.data.description,
        videoKey: result.data.videoKey,
        thumbnailKey: result.data.thumbnailKey,
      },
    });

    return {
      status: "success",
      message: "Lesson updated successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to update lesson",
    };
  }
}
