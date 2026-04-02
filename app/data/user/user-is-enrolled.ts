import prisma from "@/lib/db";
import { requireUser } from "./require-user";

export async function checkIfCourseBought(courseId: string): Promise<boolean> {
  const session = await requireUser();

  if (!session.user.id) {
    return false;
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.user.id,
        courseId: courseId,
      },
    },
    select: {
      status: true,
    },
  });

  return enrollment?.status === "COMPLETED" ? true : false;
}
