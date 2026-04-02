import { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { School, TimerIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: PublicCourseType;
}

export function PublicCourseCard({ data }: iAppProps) {
  const thumbnailURL = useConstructUrl(data.fileKey);

  return (
    <Card className="group relative py-0 gap-0 rounded-t-xl">
      <Badge className="absolute top-2 right-2 z-10">{data.level}</Badge>
      <Image
        src={thumbnailURL}
        alt="Thumbnail Image of Course"
        width={600}
        height={400}
        className="w-full aspect-video"
      />

      <CardContent className="p-4 flex flex-col flex-1">
        <Link
          href={`/courses/${data.slug}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>
        <p className="text-muted-foreground text-sm leading-tight mt-2 line-clamp-2">
          {data.smallDescription}
        </p>

        <div className="flex flex-col mt-auto">
          <div className="flex my-4 gap-x-5">
            <div className="flex items-center gap-x-2">
              <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
              <p className="text-sm text-muted-foreground">{data.duration}h</p>
            </div>
            <div className="flex items-center gap-x-2">
              <School className="size-6 p-1 rounded-md text-primary bg-primary/10" />
              <p className="text-sm text-muted-foreground">
                {data.category.charAt(0).toUpperCase() +
                  data.category.slice(1).toLowerCase()}
              </p>
            </div>
          </div>

          <Link
            href={`/courses/${data.slug}`}
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

function PublicCourseCardSkeleton() {
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

export function PublicCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
