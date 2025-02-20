"use server";
import { articles } from "@/db/schema";
import { db } from "@/lib/db";
import { NextApiRequest, NextApiResponse } from "next";
import axios from "axios";
import { ilike, and, eq } from "drizzle-orm";
import type { SQL } from "drizzle-orm";
import { userPreferences } from "@/db/schema";

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

interface querySchema {
  category: string;
  date: string;
  title: string;
  source: string;
  snippet: string;
  page: number;
  limit: number;
}

interface userPreferenceSchema {
  category: Array<string>;
  language: string;
  location: string;
}

async function get_news(userId: string) {
  try {
    const userPreference = await db
      .select()
      .from(userPreferences)
      .where(eq(userPreferences?.userId, userId));

    if (!userPreference) {
      console.log("userPreference not created");
      return
    }

    const { category, language, location } =
      userPreference as unknown as userPreferenceSchema;
    console.log(category);

    let config = {
      method: "get",
      maxBodyLength: Infinity,
      url: `https://google.serper.dev/news
            ?q=${category.join("+")}
            &location=Mumbai%2C+Maharashtra%2C+India
            &gl=${location}
            &hl=${language}
            &num=${20}
            &tbs=qdr%3Ay
            &page=${2}
            &apiKey=${process.env.SERPER_API_KEY}`,
      headers: {},
    };

    const response = await axios.request(config);
    const data = JSON.parse(response?.data);
    console.log(data);
    return data;
  } catch (error) {
    console.log("Internal Server Error in get_news function", error);
    return;
  }
}

//it will run hourly and store data in database.
export async function POST(
  req: NextApiRequest,
  res: NextApiResponse,
  { params }: { params: { userId: string } }
) {
  try {
    const { userId } = params;
    console.log(userId);
    const newsDatas: ArticlesSchemas = await get_news(userId);

    if (!newsDatas.news.length) {
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
  req: NextApiRequest,
  res: NextApiResponse,
  { params }: { params: { userId: string } }
) {
  try {
    const { category, date, title, source, snippet } =
      req.query as unknown as querySchema;
    const { userId } = params;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * Number(limit);

    let filter: SQL[] = [];

    if (userId) filter.push(eq(articles?.userId, userId));
    if (category) filter.push(eq(articles?.category, category));
    if (date) filter.push(eq(articles?.date, date));
    if (title) filter.push(ilike(articles?.title, `%${title}%`));
    if (source) filter.push(ilike(articles?.source, `%${source}`));
    if (snippet) filter.push(ilike(articles?.snippet, `%${snippet}`));

    const news = await db
      .select()
      .from(articles)
      .where(and(...filter))
      .limit(limit)
      .offset(skip);

    return res.status(200).send({ message: "News reterived successfully", data: news });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "Internal server error" });
  }
}
