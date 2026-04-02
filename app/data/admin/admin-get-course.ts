import "server-only";

import prisma from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export async function adminGetCourses(courseId: string) {
  await requireAdmin();

  const data = await prisma.course.findUnique({
    where: {
      id: courseId,
    },
    select: {
      id: true,
      title: true,
      description: true,
      category: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      fileKey: true,
      slug: true,
      chapters: {
        include: {
          lessons: true,
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export type AdminCourseSingularType = Awaited<
  ReturnType<typeof adminGetCourses>
>;
