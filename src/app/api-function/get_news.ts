"use server";
import { db } from "@/lib/db";
import axios from "axios";
import { eq } from "drizzle-orm";
import { userPreferences } from "@/db/schema";

interface userPreferenceSchema {
  category: Array<string>;
  language: string;
  location: string;
}

export async function get_news(userId: string) {
    try {
      
      if (!db) {
        return new Response(JSON.stringify({ message: "Database connection is not available", data: null }), { status: 500 });
    }
      const userPreference = await db
        .select()
        .from(userPreferences)
        .where(eq(userPreferences?.userId, userId));
  
      if (!userPreference || userPreference.length === 0) {
        console.log("userPreference not created or empty");
        return;
      }
  
      const { category, language, location } =
        userPreference[0] as unknown as userPreferenceSchema;
  
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://google.serper.dev/news?q=${category
          .slice()
          .join(
            "+"
          )}&location=Mumbai%2C+Maharashtra%2C+India&gl=${location}&hl=${language}&num=20&tbs=qdr:y&page=3`,
        headers: {
          "X-API-KEY": process.env.SERPER_API_KEY,
        },
      };
  
      const response = await axios.request(config);
  
      const data = response?.data;
      return data;
    } catch (error) {
      console.log("Internal Server Error in get_news function", error);
      return;
    }
  }
  