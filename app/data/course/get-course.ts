import prisma from "@/lib/db";
import { notFound } from "next/navigation";

export async function getCourseBySlug(slug: string) {
  const data = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      category: true,
      level: true,
      description: true,
      duration: true,
      fileKey: true,
      price: true,
      title: true,
      status: true,
      smallDescription: true,
      chapters: {
        select: {
          id: true,
          title: true,
          lessons: {
            select: {
              id: true,
              title: true,
            },
            orderBy: {
              position: "asc",
            },
          },
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}
