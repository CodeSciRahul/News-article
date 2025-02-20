import { db } from "@/lib/db";
import { userPreferences } from "@/db/schema";
import { NextApiRequest,NextApiResponse } from "next";
import {z} from "zod"
import { eq } from "drizzle-orm";
import { NextRequest } from "next/server";

const categoryItemSchema = z.object({
    category: z.string()
})

export const userPreferencesSchema = z.object({
    userId: z.string(),
    category: z.array(categoryItemSchema),
    language: z.string().optional(),
    location: z.string().optional()
  });
  

export async function POST(req: NextApiRequest, res: NextApiResponse){
    try {
        const body = await req.body;
        const validation = userPreferencesSchema.safeParse(body);
        if(!validation.success) {
            return res.status(200).send({message: "Give correct payload"});
        }
        const {userId,category, language, location} = validation?.data
       const result=await db.insert(userPreferences).values({
            userId,
            category,
            language,
            location
        })
        return res.status(200).send({message: "User preference saved successfully", data: result});
    } catch (error) {
        return res.status(500).send({message: "Server error", error: error});
    }
}

export async function GET(req: NextRequest, { params }: { params: { userId: string } }) {
    try {
        const { userId } = await params;
        console.log("userId:", userId);

        const userPreference = await db.select().from(userPreferences).where(eq(userPreferences.userId, userId));

        if (!userPreference.length) {
            return new Response(JSON.stringify({ message: "User preference not found" }), { status: 400 });
        }

        return new Response(JSON.stringify({ message: "User Preference found", data: userPreference }), { status: 200 });
    } catch (error) {
        console.error("Error fetching user preference:", error);
        return new Response(JSON.stringify({ message: "Internal server error", error }), { status: 500 });
    }
}

export async function PUT(){

}