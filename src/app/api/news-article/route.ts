"use server";
import { articles } from "@/db/schema";
import { db } from "@/lib/db";
import axios from "axios";
import { ilike, and, eq } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { userPreferences } from "@/db/schema";
import { NextRequest } from "next/server";
import { auth } from "@clerk/nextjs/server";

interface articleSchema {
  title: string;
  link: string;
  snippet: string;
  date: string;
  source: string;
  imageUrl: string;
  position: number;
}

interface ArticlesSchemas {
  news: [articleSchema];
}

interface userPreferenceSchema {
  category: Array<string>;
  language: string;
  location: string;
}

type RouteContext = {
  params: Promise<{
    userId: string
  }>
}
async function get_news(userId: string) {
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
        )}&location=Mumbai%2C+Maharashtra%2C+India&gl=${location}&hl=${language}&num=20&tbs=qdr:y&page=2`,
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

//it will run hourly and store data in database.
export async function POST(
  req: NextRequest,
) {
  try {
    
    if (!db) {
      return new Response(JSON.stringify({ message: "Database connection is not available", data: null }), { status: 500 });
  }
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User ID is null");
  }
  const authData = await auth();
  const token = await authData.getToken(); 
  const newsDatas: ArticlesSchemas = await get_news(userId);

    if (!newsDatas?.news?.length) {
      console.log("news not found");
      return;
    }

    const existingNews = await db
      .select()
      .from(articles)
      .where(eq(articles.userId, userId));
    const existingLinks = new Set(existingNews.map((news) => news.link));

    const newsNotExistInUserDB = newsDatas.news.filter(
      (news) => !existingLinks.has(news.link)
    );

    if (newsNotExistInUserDB.length > 0) {
      await db.insert(articles).values(
        newsNotExistInUserDB.map((news) => ({
          userId,
          title: news.title,
          link: news.link,
          snippet: news.snippet,
          date: news.date,
          source: news.source,
          imageUrl: news.imageUrl,
          category: "general",
          createdAt: new Date(),
        }))
      );
    }

    return;
  } catch (error) {
    console.error("Internal Server error\n", error);
  }
}

export async function GET(
  req: NextRequest,
) {
  try {
    
    if (!db) {
      return new Response(JSON.stringify({ message: "Database connection is not available", data: null }), { status: 500 });
  }
    const category = req.nextUrl.searchParams.get("category");
    const date = req.nextUrl.searchParams.get("date");
    const title = req.nextUrl.searchParams.get("title");
    const source = req.nextUrl.searchParams.get("source");
    const snippet = req.nextUrl.searchParams.get("snippet");

    const { userId } = await auth();
    const authData = await auth();
    const token = await authData.getToken();
    console.log("token from news-article", token);
    const page = Number(req.nextUrl.searchParams.get("page")) || 1;
    const limit = Number(req.nextUrl.searchParams.get("limit")) || 10;
    const skip = (page - 1) * Number(limit);

    const filter: SQL[] = [];

    if (userId) filter.push(eq(articles?.userId, userId));
    if (category) filter.push(eq(articles?.category, category));
    if (date) filter.push(eq(articles?.date, date));
    if (title) filter.push(ilike(articles?.title, `%${title}%`));
    if (source) filter.push(ilike(articles?.source, `%${source}`));
    if (snippet) filter.push(ilike(articles?.snippet, `%${snippet}`));

    let allNews = await db
      .select()
      .from(articles)
      .where(and(...filter))

    if (!allNews.length && userId) {
      // Call POST function to fetch and save news
      await POST(req);

      // Fetch news again after inserting
      allNews = await db
        .select()
        .from(articles)
        .where(and(...filter))
  }
    // Apply pagination on the filtered results
    const paginatedNews = allNews.slice(skip, skip + limit);

    const totalNewsCount = allNews.length;
    const totalPages = Math.ceil(totalNewsCount / limit);



    return new Response(
      JSON.stringify({ message: "News reterived successfully", data: paginatedNews, totalPages }),
      { status: 200 }
    );
  } catch (error) {
    console.log(error);
    return new Response(
      JSON.stringify({ message: "Internal server error", data: null, error }),
      { status: 500 }
    );
  }
}
