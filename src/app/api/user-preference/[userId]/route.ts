import { db } from "@/lib/db";
import { userPreferences } from "@/db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

const userPreferencesSchema = z.object({
  category: z.array(z.string()),
  language: z.string().optional(),
  location: z.string().optional(),
});

type RouteContext = {
  params: Promise<{
    userId: string;
  }>;
};

export async function POST(req: NextRequest, context: RouteContext) {
  try {
    const body = await req.json();
    const { userId } = await context.params;
    const validation = userPreferencesSchema.safeParse(body);
    if (!validation.success) {
      return new Response(
        JSON.stringify({ message: "Give correct payload", data: null }),
        { status: 400 }
      );
    }
    const { category, language, location } = validation?.data;

    if (!db) {
      return new Response(
        JSON.stringify({
          message: "Database connection is not available",
          data: null,
        }),
        { status: 500 }
      );
    }
    const result = await db.insert(userPreferences).values({
      userId,
      category,
      language,
      location,
    });
    return new Response(
      JSON.stringify({
        message: "User preference saved successfully",
        data: result,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        message: "Internal server error",
        data: null,
        error: error,
      }),
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest, context: RouteContext) {
  try {
    const { userId } = await context.params;

    if (!db) {
      return new Response(
        JSON.stringify({
          message: "Database connection is not available",
          data: null,
        }),
        { status: 500 }
      );
    }
    const userPreference = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences.userId, userId));

    if (!userPreference.length) {
      return new Response(
        JSON.stringify({ message: "User preference not found", data: null }),
        { status: 400 }
      );
    }

    return new Response(
      JSON.stringify({
        message: "User Preference found",
        data: userPreference[0],
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ message: "Internal server error", error }),
      { status: 500 }
    );
  }
}

export async function PUT() {}
