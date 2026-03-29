import * as z from "zod";

export const courseLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export const courseStatus = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export const courseCategories = [
  "DEVELOPMENT",
  "BUSINESS",
  "FINANCE",
  "IT & SOFTWARE",
  "OFFICE PRODUCTIVITY",
  "PERSONAL DEVELOPMENT",
  "DESIGN",
  "MARKETING",
  "HEALTH & FITNESS",
  "MUSIC",
  "TEACHING & ACADEMICS",
] as const;

export const courseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters" })
    .max(100, { message: "Title must be at most 100 characters" }),
  description: z
    .string()
    .min(3, { message: "Description must be at least 3 characters" }),
  fileKey: z.string().min(1, { message: "File is required" }),
  price: z.coerce.number().min(1, "Price must be a positive number"),
  duration: z.coerce
    .string()
    .min(1, { message: "Duration must be at least 1 hour" })
    .max(500, { message: "Duration must be at most 500 hours" }),
  level: z.enum(courseLevels, {
    message: "Level must be one of: BEGINNER, INTERMEDIATE, ADVANCED",
  }),
  category: z.enum(courseCategories, { message: "Category is required" }),
  smallDescription: z
    .string()
    .min(3, { message: "Small description must be at least 3 characters" })
    .max(200, { message: "Small description must be at most 200 characters" }),
  slug: z.string().min(3, { message: "Slug must be at least 3 characters" }),
  status: z.enum(courseStatus, {
    message: "Status must be one of: DRAFT, PUBLISHED, ARCHIVED",
  }),
});

export type CourseSchemaInput = z.input<typeof courseSchema>;
export type CourseSchemaOutput = z.output<typeof courseSchema>;
