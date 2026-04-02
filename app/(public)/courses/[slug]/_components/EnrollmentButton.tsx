"use client";

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useTransition } from "react";
import { toast } from "sonner";
import { enrollInCourseAction } from "../actions";
import { Loader2 } from "lucide-react";

export function EnrollmentButton({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();

  async function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        enrollInCourseAction(courseId),
      );

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <Button className="w-full" onClick={onSubmit} disabled={isPending}>
      {isPending ? (
        <>
          <Loader2 className="size-4 animate-spin" />
          <span>Enrolling...</span>
        </>
      ) : (
        <span>Enroll Now!</span>
      )}
    </Button>
  );
}
