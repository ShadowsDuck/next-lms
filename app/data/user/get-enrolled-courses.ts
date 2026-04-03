import "server-only";
import { requireUser } from "./require-user";
import prisma from "@/lib/db";

export async function getEnrolledCourses() {
  const session = await requireUser();

  const data = await prisma.enrollment.findMany({
    where: {
      userId: session.user.id,
      status: "COMPLETED",
    },
    select: {
      course: {
        select: {
          id: true,
          smallDescription: true,
          title: true,
          fileKey: true,
          level: true,
          slug: true,
          duration: true,
          category: true,
          chapters: {
            select: {
              id: true,
              title: true,
              position: true,
              lessons: {
                select: {
                  id: true,
                  lessonProgress: {
                    where: {
                      userId: session.user.id,
                    },
                    select: {
                      completed: true,
                      id: true,
                      lessonId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });

  return data;
}

export type EnrolledCoursesType = Awaited<
  ReturnType<typeof getEnrolledCourses>
>[0];
