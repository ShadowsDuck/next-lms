import { getAllCourses } from "@/app/data/course/get-all-courses";
import { Suspense } from "react";
import {
  PublicCourseCard,
  PublicCourseCardSkeletonLayout,
} from "../_components/PublicCourseCard";

export default function CoursesPage() {
  return (
    <div className="mt-5">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-3xl md:text-4xl font-bold tracking">
          Explore Courses
        </h1>
        <p className="text-muted-foreground">
          Discover our catalog of courses and find the perfect one for you.
        </p>
      </div>

      <Suspense fallback={<PublicCourseCardSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}

async function RenderCourses() {
  const data = await getAllCourses();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {data.map((course) => (
        <PublicCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}
