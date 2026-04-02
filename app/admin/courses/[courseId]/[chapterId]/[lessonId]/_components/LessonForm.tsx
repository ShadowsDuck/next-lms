"use client";

import { AdminLessonType } from "@/app/data/admin/admin-get-lesson";
import { Uploader } from "@/components/file-uploader/Uploader";
import { RichTextEditor } from "@/components/rich-text-editor/Editor";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { tryCatch } from "@/hooks/try-catch";
import {
  lessonSchema,
  LessonSchemaInput,
  LessonSchemaType,
} from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Loader2, Save } from "lucide-react";
import Link from "next/link";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { updateLesson } from "../actions";
import { toast } from "sonner";

interface iAppProps {
  data: AdminLessonType;
  chapterId: string;
  courseId: string;
}

export default function LessonForm({ data, chapterId, courseId }: iAppProps) {
  const [isPending, startTransition] = useTransition();

  const form = useForm<LessonSchemaInput, unknown, LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: data.title,
      courseId: courseId,
      chapterId: chapterId,
      description: data.description ?? undefined,
      thumbnailKey: data.thumbnailKey ?? undefined,
      videoKey: data.videoKey ?? undefined,
    },
  });

  async function onSubmit(values: LessonSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        updateLesson(values, data.id),
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
    <div>
      <Link
        href={`/admin/courses/${courseId}/edit`}
        className={buttonVariants({ variant: "outline" })}
      >
        <ArrowLeft className="size-4" />
        <span>Go Back</span>
      </Link>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Lesson Configuration</CardTitle>
          <CardDescription>
            Configure the video and description for this lesson
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              {/* Name */}
              <Controller
                name="name"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Lesson Name</FieldLabel>
                    <Input
                      {...field}
                      aria-invalid={fieldState.invalid}
                      placeholder="Enter lesson name"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* Description */}
              <Controller
                name="description"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Description</FieldLabel>
                    <RichTextEditor field={field} />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* ThumbnailKey */}
              <Controller
                name="thumbnailKey"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Thumbnail Image</FieldLabel>
                    <Uploader
                      value={field.value}
                      onChange={field.onChange}
                      fileTypeAccepted="image"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              {/* VideoKey */}
              <Controller
                name="videoKey"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Video File</FieldLabel>
                    <Uploader
                      value={field.value}
                      onChange={field.onChange}
                      fileTypeAccepted="video"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Updating...
                </>
              ) : (
                <>
                  <Save className="size-4" />
                  Update Lesson
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
