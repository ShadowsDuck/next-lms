import { getCourseSidebarData } from "@/app/data/course/get-course-sidebar-data";
import { CourseSidebar } from "../_components/CourseSidebar";

interface iAppProps {
  params: Promise<{ slug: string }>;
  children: React.ReactNode;
}

export default async function DashboardCourseDetailLayout({
  params,
  children,
}: iAppProps) {
  const { slug } = await params;

  // server-side security check and lightweight data fetching
  const course = await getCourseSidebarData(slug);

  return (
    <div className="flex flex-1">
      {/* Sidebar 30% */}
      <div className="w-1/3 border-r border-border shrink-0">
        <CourseSidebar course={course} />
      </div>

      {/* Main Content 70% */}
      <div className="w-2/3 flex-1 overflow-hidden">{children}</div>
    </div>
  );
}
