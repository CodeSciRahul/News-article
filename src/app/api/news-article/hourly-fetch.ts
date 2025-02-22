import { NextApiRequest, NextApiResponse } from "next";
import { db } from "@/lib/db";
import { articles,userPreferences } from "@/db/schema";
import { eq } from "drizzle-orm";
import { get_news } from "@/app/api-function/get_news";

interface NewsData {
    title: string;
    link: string;
    snippet: string;
    date: string;
    source: string;
    imageUrl: string;
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET") {
    return res.status(405).json({ message: "Method not allowed" });
  }

  try {
    const allUsers = await db.select().from(userPreferences); // Fetch all users from the DB

    for (const user of allUsers) {
      const userId = user.userId;

      // Call the same news fetching logic
      const newsDatas = await get_news(userId);

      if (!newsDatas?.news?.length) continue;

      const existingNews = await db
        .select()
        .from(articles)
        .where(eq(articles.userId, userId));

      const existingLinks = new Set(existingNews.map((news) => news.link));

      const newsNotExistInUserDB = newsDatas.news.filter(
        (news: NewsData) => !existingLinks.has(news.link)
      );

      if (newsNotExistInUserDB.length > 0) {

        const newsNotExistInUserDB: NewsData[] = newsDatas.news.filter(
            (news: NewsData) => !existingLinks.has(news.link)
        );

        if (newsNotExistInUserDB.length > 0) {
            await db.insert(articles).values(
                newsNotExistInUserDB.map((news: NewsData) => ({
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
      }
    }

    return res.status(200).json({ message: "Hourly news fetch complete" });
  } catch (error) {
    console.error("Error running hourly fetch: ", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}
