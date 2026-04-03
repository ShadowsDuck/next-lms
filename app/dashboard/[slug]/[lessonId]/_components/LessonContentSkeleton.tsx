"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function LessonContentSkeleton() {
  return (
    <div className="flex flex-col h-full bg-background pl-6">
      {/* Video player skeleton */}
      <Skeleton className="w-full aspect-video rounded-lg" />

      {/* Action bar skeleton (Mark as Complete button) */}
      <div className="py-4 border-b">
        <Skeleton className="h-10 w-[160px] rounded-md" />
      </div>

      {/* Content skeleton */}
      <div className="space-y-4 mt-6">
        {/* Title skeleton */}
        <Skeleton className="h-9 w-3/4 md:w-1/2" />

        {/* Description/Rich text skeleton */}
        <div className="space-y-2 mt-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-[90%]" />
          <Skeleton className="h-4 w-[80%]" />
          <Skeleton className="h-4 w-[60%]" />
        </div>
      </div>
    </div>
  );
}
