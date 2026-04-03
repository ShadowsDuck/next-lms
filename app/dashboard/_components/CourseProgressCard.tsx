"use client";

import { EnrolledCoursesType } from "@/app/data/user/get-enrolled-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { useCourseProgress } from "@/hooks/use-course-progress";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: EnrolledCoursesType;
}

export function CourseProgressCard({ data }: iAppProps) {
  const thumbnailURL = useConstructUrl(data.course.fileKey);

  const { totalLessons, completedLessons, progressPercentage } =
    useCourseProgress({
      courseData: data.course,
    });

  return (
    <Card className="group relative py-0 gap-0 rounded-t-xl">
      <Badge className="absolute top-2 right-2 z-10">{data.course.level}</Badge>
      <Image
        src={thumbnailURL}
        alt="Thumbnail Image of Course"
        width={600}
        height={400}
        className="w-full aspect-video"
      />

      <CardContent className="p-4 flex flex-col flex-1">
        <Link
          href={`/dashboard/${data.course.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.course.title}
        </Link>
        <p className="text-muted-foreground text-sm leading-tight mt-2 line-clamp-2">
          {data.course.smallDescription}
        </p>

        <div className="flex flex-col mt-auto space-y-4">
          <div className="mt-2">
            <div className="flex justify-between mb-1 text-sm">
              <p>Progress:</p>
              <p className="font-medium">{progressPercentage}%</p>
            </div>

            <Progress
              value={progressPercentage}
              className="h-1.5 rounded-full"
            />
            <p className="text-xs text-muted-foreground mt-3">
              {completedLessons} of {totalLessons} lessons completed
            </p>
          </div>

          <Link
            href={`/dashboard/${data.course.slug}`}
            className={buttonVariants({
              className: "w-full",
            })}
          >
            Learn More
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function CourseProgressCardSkeleton() {
  return (
    // ใช้ overflow-hidden เพื่อให้รูปภาพ Skeleton ไม่ทะลุขอบโค้งของ Card
    <Card className="group relative py-0 gap-0 rounded-xl overflow-hidden">
      {/* Badge Level Skeleton */}
      <Skeleton className="absolute top-2 right-2 z-10 h-6 w-20 rounded-full" />

      {/* Thumbnail Image Skeleton */}
      <Skeleton className="w-full aspect-video rounded-none" />

      <CardContent className="p-4">
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4" />

        {/* Small Description Skeleton (จำลอง 2 บรรทัดด้วย space-y-2) */}
        <div className="space-y-2 mt-3">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
        </div>

        {/* Stats Row Skeleton (Duration & Category) */}
        <div className="mt-5 flex items-center gap-x-5">
          {/* Duration */}
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-10" />
          </div>
          {/* Category */}
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-20" />
          </div>
        </div>

        {/* Learn More Button Skeleton */}
        <Skeleton className="h-8 w-full mt-5 rounded-md" />
      </CardContent>
    </Card>
  );
}

export function CourseProgressCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {Array.from({ length: 4 }).map((_, index) => (
        <CourseProgressCardSkeleton key={index} />
      ))}
    </div>
  );
}
