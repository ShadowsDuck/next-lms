"use client";

import { AdminCoursesType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct-url";
import {
  ArrowRight,
  Eye,
  MoreVertical,
  Pencil,
  School,
  TimerIcon,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
  data: AdminCoursesType;
}

export function AdminCourseCard({ data }: iAppProps) {
  return (
    <Card className="group relative py-0 gap-0 rounded-lg">
      {/* absolute dropdown */}
      <div className="absolute top-2 right-2 z-10">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="secondary"
              size="icon"
              className="focus-visible:ring-0 focus-visible:border-transparent"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40 space-y-0.5 p-1">
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/courses/${data.id}/edit`}
                className="w-full cursor-pointer"
              >
                <Pencil className="size-4 mr-2" />
                Edit Course
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href={`/admin/courses/${data.id}`}
                className="w-full cursor-pointer"
              >
                <Eye className="size-4 mr-2" />
                Preview
              </Link>
            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem
              variant="destructive"
              className="cursor-pointer"
              asChild
            >
              <Link
                href={`/admin/courses/${data.id}/delete`}
                className="w-full"
              >
                <Trash2 className="size-4 mr-2" />
                Delete
              </Link>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Image
        src={useConstructUrl(data.fileKey)}
        alt="Thumbnail URL"
        width={600}
        height={400}
        className="w-full aspect-video"
      />

      <CardContent className="p-4 flex flex-col flex-1">
        <Link
          href={`/admin/courses/${data.id}`}
          className="font-medium text-lg line-clamp-2 hover:underline group-hover:text-primary transition-colors"
        >
          {data.title}
        </Link>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-tight mt-2">
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
              <p className="text-sm text-muted-foreground">{data.level}</p>
            </div>
          </div>

          <Link
            href={`/admin/courses/${data.id}/edit`}
            className={buttonVariants({ className: "w-full" })}
          >
            Edit Course <ArrowRight className="size-4" />
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

function AdminCourseCardSkeleton() {
  return (
    <Card className="group relative py-0 gap-0 rounded-lg overflow-hidden">
      {/* Absolute dropdown Button Skeleton */}
      <div className="absolute top-2 right-2 z-10">
        <Skeleton className="size-10 rounded-md" />
      </div>

      {/* Image Skeleton */}
      <Skeleton className="w-full aspect-video rounded-none" />

      <CardContent className="p-4">
        {/* Title Skeleton */}
        <Skeleton className="h-6 w-3/4" />

        {/* Small Description Skeleton (จำลอง 2 บรรทัด) */}
        <div className="space-y-2 mt-3">
          <Skeleton className="h-3.5 w-full" />
          <Skeleton className="h-3.5 w-5/6" />
        </div>

        {/* Info (Duration & Level) Skeleton */}
        <div className="flex items-center mt-5 gap-x-5">
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-8" />
          </div>
          <div className="flex items-center gap-x-2">
            <Skeleton className="size-6 rounded-md" />
            <Skeleton className="h-4 w-16" />
          </div>
        </div>

        {/* Edit Button Skeleton */}
        <Skeleton className="h-10 w-full mt-5 rounded-md" />
      </CardContent>
    </Card>
  );
}

export function AdminCourseCardSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
