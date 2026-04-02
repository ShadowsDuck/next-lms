"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import prisma from "@/lib/db";
import { courseSchema, CourseSchemaType } from "@/lib/schema";
import { stripe } from "@/lib/stripe";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    window: "1m",
    max: 5,
  }),
);

export async function createCourse(
  data: CourseSchemaType,
): Promise<ApiResponse> {
  const session = await requireAdmin();

  try {
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id,
    });

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many requests",
        };
      }

      if (decision.reason.isBot()) {
        return {
          status: "error",
          message: "You are a bot! if this is a mistake contact our support",
        };
      }
    }

    const validatedData = courseSchema.safeParse(data);

    if (!validatedData.success) {
      return {
        status: "error",
        message: "Invalid Form data",
      };
    }

    const stripeProduct = await stripe.products.create({
      name: validatedData.data.title,
      description: validatedData.data.description,
      default_price_data: {
        unit_amount: validatedData.data.price * 100,
        currency: "usd",
      },
    });

    await prisma.course.create({
      data: {
        ...validatedData.data,
        userId: session?.user.id as string,
        stripePriceId: stripeProduct.default_price as string,
      },
    });

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch (error) {
    console.log(error);
    return {
      status: "error",
      message: "Failed to create course",
    };
  }
}
