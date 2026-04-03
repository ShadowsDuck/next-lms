import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";

interface iAppProps {
  courseData: CourseSidebarDataType;
}

interface CourseProgressResult {
  totalLessons: number;
  completedLessons: number;
  progressPercentage: number;
}

export function useCourseProgress({
  courseData,
}: iAppProps): CourseProgressResult {
  let totalLessons = 0;
  let completedLessons = 0;

  courseData.chapters.forEach((chapter) => {
    chapter.lessons.forEach((lesson) => {
      totalLessons++;

      // check if this lesson is completed
      const isCompleted = lesson.lessonProgress.some(
        (progress) => progress.completed,
      );

      if (isCompleted) {
        completedLessons++;
      }
    });
  });

  const progressPercentage =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;

  return {
    totalLessons,
    completedLessons,
    progressPercentage,
  };
}
