import { db } from "@/lib/db";
import { articles, userPreferences } from "@/db/schema";
import { eq } from "drizzle-orm";
import { get_news } from "@/app/api-function/get_news";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

interface NewsData {
    title: string;
    link: string;
    snippet: string;
    date: string;
    source: string;
    imageUrl: string;
    description?: string;
    category?: string;
}

/**
 * Generates a description and category for a news article using Gemini AI.
 */
// import { genAI } from "@/lib/gemini"; // Ensure correct import

async function enhanceNewsArticle(news: NewsData): Promise<NewsData> {
    const systemPrompt = `You are an AI that summarizes and classifies news articles.
        Given a news article with a title and snippet, generate:
        1. A brief but informative description (50-100 words).
        2. The most relevant category from: ["Politics", "Business", "Technology", "Entertainment", "Sports", "Health", "Science", "World", "Other"].
        Respond in strict JSON format: { "description": "...", "category": "..." }.
    `;

    try {
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

        const prompt = `Title: ${news.title}\nSnippet: ${news.snippet}\n\nGenerate description and category:`;

        // Correct way to call generateContent
        const result = await model.generateContent([systemPrompt, prompt]);


        let aiResponse = await result.response.text();

        // If response is wrapped in ```json ... ```
        aiResponse = aiResponse.replace(/```json|```/g, "").trim();

        const parsedResponse = JSON.parse(aiResponse);

        return {
            ...news,
            description: parsedResponse.description || "No description available.",
            category: parsedResponse.category || "Other",
        };
    } catch (error) {
        console.error("Error generating news description:", error);
        return { ...news, description: "Error generating description", category: "Other" };
    }
}


/**
 * Fetches and stores news for all users, enhancing it with AI-generated descriptions and categories.
 */
export async function GET() {
    try {
        const allUsers = await db.select().from(userPreferences);

        for (const user of allUsers) {
            const userId = user.userId;

            // Fetch news from API
            const newsDatas = await get_news(userId);
            if (!newsDatas?.news?.length) continue;

            // Get existing news links to avoid duplicates
            const existingNews = await db
                .select()
                .from(articles)
                .where(eq(articles.userId, userId));

            const existingLinks = new Set(existingNews.map((news) => news.link));

            // Filter out already stored news
            let newsToInsert = newsDatas.news.filter((news: NewsData) => !existingLinks.has(news.link));

            // Enhance news with AI-generated descriptions and categories
            newsToInsert = await Promise.all(newsToInsert.map(enhanceNewsArticle));
            console.log("new data ", newsToInsert)

            // Store in DB
            if (newsToInsert.length > 0) {
                await db.insert(articles).values(
                    newsToInsert.map((news: NewsData) => ({
                        userId,
                        title: news.title,
                        link: news.link,
                        snippet: news.snippet,
                        date: news.date,
                        source: news.source,
                        imageUrl: news.imageUrl,
                        description: news.description,
                        category: news.category,
                        createdAt: new Date(),
                    }))
                );
            }
        }

        return new Response(
            JSON.stringify({ message: "News retrieved and stored successfully" }),
            { status: 200 }
        );
    } catch (error) {
        console.error("Error running hourly fetch: ", error);
        return new Response(
            JSON.stringify({ message: "Internal server error", error }),
            { status: 500 }
        );
    }
}
