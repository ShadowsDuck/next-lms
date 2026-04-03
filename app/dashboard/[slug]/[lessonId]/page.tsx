import { getLessonContent } from "@/app/data/course/get-lesson-content";
import { LessonContent } from "./_components/LessonContent";
import { Suspense } from "react";
import { LessonContentSkeleton } from "./_components/LessonContentSkeleton";

type Params = Promise<{ lessonId: string }>;

export default async function LessonDetailPage({ params }: { params: Params }) {
  const { lessonId } = await params;

  return (
    <Suspense fallback={<LessonContentSkeleton />}>
      <LessonContentLoader lessonId={lessonId} />
    </Suspense>
  );
}

async function LessonContentLoader({ lessonId }: { lessonId: string }) {
  const data = await getLessonContent(lessonId);

  return <LessonContent data={data} />;
}
