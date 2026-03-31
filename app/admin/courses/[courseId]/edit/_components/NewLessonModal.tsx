"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { tryCatch } from "@/hooks/try-catch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "sonner";
import {
  LessonSchemaInput,
  LessonSchemaType,
  lessonSchema,
} from "@/lib/schema";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { createLesson } from "../actions";

export function NewLessonModal({
  courseId,
  chapterId,
}: {
  courseId: string;
  chapterId: string;
}) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<LessonSchemaInput, unknown, LessonSchemaType>({
    resolver: zodResolver(lessonSchema),
    defaultValues: {
      name: "",
      courseId: courseId,
      chapterId: chapterId,
    },
  });

  async function onSubmit(values: LessonSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(createLesson(values));

      if (error) {
        toast.error(error.message);
        return;
      }

      if (result.status === "success") {
        toast.success(result.message);
        form.reset();
        setOpen(false);
      } else if (result.status === "error") {
        toast.error(result.message);
      }
    });
  }

  function handleOpenChange(open: boolean) {
    if (!open) {
      form.reset();
    }

    setOpen(open);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="w-full">
          <Plus className="size-4" />
          New Lesson
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Lesson Modal</DialogTitle>
          <DialogDescription>
            What would you like to name you lesson?
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(onSubmit, (errors) =>
            console.log("Zod Errors:", errors),
          )}
          className="space-y-4"
        >
          <FieldGroup>
            {/* Name */}
            <Controller
              name="name"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel>Name</FieldLabel>
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
          </FieldGroup>

          <DialogFooter>
            <Button type="submit" disabled={isPending} className="w-full">
              {isPending ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <Plus className="size-4" />
                  Create
                </>
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
