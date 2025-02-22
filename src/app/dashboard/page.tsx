"use server"

import { currentUser } from "@clerk/nextjs/server";
import UserPreferenceModel from "@/components/model";
import { DashboardArticle } from "@/components/dashboardArticle";
import { NextPage } from "next";

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page: NextPage<DashboardPageProps> = async ({ searchParams }) => {
  try {
    const resolvedSearchParams = await searchParams;
    const { category, date, title, source, snippet, page } = resolvedSearchParams;

    // Fetch the current user
    const user = await currentUser();
    if (!user) return <div>Loading...</div>;

    let checkUserPreference;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-preference/${user?.id}`); // Using relative path

      if (!response.ok) {
        console.error("Failed to fetch user preferences");
        console.error("Status:", response.status);
        console.error("Response:", await response.text());
        throw new Error("Failed to fetch user preferences");
      }

      checkUserPreference = await response.json();
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      return <div className="flex justify-center items-center">Error fetching user preferences. Please try again later.</div>;
    }

    const data = checkUserPreference?.data;

    // If user preferences exist, fetch articles
    if (data) {
      const queryParams = new URLSearchParams(
        Object.entries({
          ...(page && { page: Array.isArray(page) ? page.join(",") : page }),
          ...(category && {
            category: Array.isArray(category) ? category.join(",") : category,
          }),
          ...(date && { date: Array.isArray(date) ? date.join(",") : date }),
          ...(title && { title: Array.isArray(title) ? title.join(",") : title }),
          ...(source && { source: Array.isArray(source) ? source.join(",") : source }),
          ...(snippet && { snippet: Array.isArray(snippet) ? snippet.join(",") : snippet }),
        })
      ).toString();

      let newsData;
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news-article/${user?.id}?${queryParams}`);

        if (!res.ok) {
          console.error("Failed to fetch news articles");
          console.error("Status:", res.status);
          console.error("Response:", await res.text());
          throw new Error("Failed to fetch news articles");
        }

        newsData = await res.json();
      } catch (error) {
        console.error("Error fetching news articles:", error);
        return <div>Error fetching news articles. Please try again later.</div>;
      }

      return <DashboardArticle news={newsData} />;
    }

    // If no user preferences, prompt user to set them
    return <UserPreferenceModel />;
  } catch (error) {
    console.error("An unexpected error occurred:", error);
    return <div>Something went wrong. Please refresh the page or try again later.</div>;
  }
};

export default Page;
