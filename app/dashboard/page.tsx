import { PublicCourseCard } from "../(public)/_components/PublicCourseCard";
import { getAllCourses } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import { EmptyState } from "@/components/general/EmptyState";
import { CourseProgressCard } from "./_components/CourseProgressCard";

export default async function DashboardPage() {
  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  return (
    <>
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Enrolled Courses</h1>
        <p className="text-muted-foreground">
          Here you can see all the courses you have access to
        </p>
      </div>

      {enrolledCourses.length === 0 ? (
        <EmptyState
          title="No courses purchased"
          description="You have no purchased any courses yet"
          buttonText="Browse courses"
          href="/courses"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {enrolledCourses.map((course) => (
            <CourseProgressCard key={course.course.id} data={course} />
          ))}
        </div>
      )}

      <section className="mt-10">
        <div className="space-y-2 mb-5">
          <h1 className="text-3xl font-bold">Available Courses</h1>
          <p className="text-muted-foreground">
            Here you can see all the courses that are available for purchase
          </p>
        </div>

        {courses.filter(
          (course) =>
            !enrolledCourses.some(
              (enrolled) => enrolled.course.id === course.id,
            ),
        ).length === 0 ? (
          <EmptyState
            title="No courses available"
            description="You have already purchased all available courses"
            buttonText="Browse courses"
            href="/courses"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {courses
              .filter(
                (course) =>
                  !enrolledCourses.some(
                    (enrolled) => enrolled.course.id === course.id,
                  ),
              )
              .map((course) => (
                <PublicCourseCard key={course.id} data={course} />
              ))}
          </div>
        )}
      </section>
    </>
  );
}
