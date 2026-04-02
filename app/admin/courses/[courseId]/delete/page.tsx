"use client";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import { useParams, useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";
import Link from "next/link";
import { deleteCourse } from "./actions";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteCoursePage() {
  const { courseId } = useParams<{ courseId: string }>();

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  async function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(deleteCourse(courseId));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        router.replace("/admin/courses");
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex items-center justify-center h-full px-4">
      <Card className="max-w-xl w-full rounded-lg">
        <CardHeader>
          <CardTitle> Are you sure you want to delete this course? </CardTitle>
          <CardDescription>This action cannot be undone.</CardDescription>
        </CardHeader>

        <CardContent className="flex items-center justify-end gap-2">
          <Link
            href="/admin/courses"
            className={buttonVariants({ variant: "ghost" })}
          >
            <span>Cancel</span>
          </Link>

          <Button variant="destructive" onClick={onSubmit} disabled={isPending}>
            {isPending ? (
              <>
                <Loader2 className="size-4 animate-spin" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="size-4" />
                <span>Delete</span>
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
