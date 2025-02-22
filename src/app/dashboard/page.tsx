"use server";

import { currentUser } from "@clerk/nextjs/server";
import UserPreferenceModel from "@/components/model";
import { DashboardArticle } from "@/components/dashboardArticle";
import { NextPage } from "next";
import { Alert, AlertTitle } from "@mui/material";

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page: NextPage<DashboardPageProps> = async ({ searchParams }) => {
  try {
    const resolvedSearchParams = await searchParams;
    const { category, date, title, source, snippet, page } =
      resolvedSearchParams;

    // Fetch the current user
    const user = await currentUser();
    if (!user) return <div>Loading...</div>;

    let checkUserPreference;
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-preference/${user?.id}`
      );
      checkUserPreference = await response.json();
    } catch (error) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <Alert severity="error" className="max-w-md shadow-lg rounded-2xl">
            <AlertTitle>Connection Error {String(error)}</AlertTitle>
            Unable to fetch user preferences. Please ensure your Docker instance
            is running.
            <br />
            Run{" "}
            <code className="bg-gray-100 px-1 py-0.5 rounded">
              docker compose up -d
            </code>{" "}
            to start the required services.
          </Alert>
        </div>
      );
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
          ...(title && {
            title: Array.isArray(title) ? title.join(",") : title,
          }),
          ...(source && {
            source: Array.isArray(source) ? source.join(",") : source,
          }),
          ...(snippet && {
            snippet: Array.isArray(snippet) ? snippet.join(",") : snippet,
          }),
        })
      ).toString();

      let newsData;
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/api/news-article/${user?.id}?${queryParams}`
        );

        if (!res.ok) {
          throw new Error("Failed to fetch news articles");
        }

        newsData = await res.json();
      } catch (error) {
        return (
          <div className="flex justify-center items-center text-2xl">
            Error fetching news articles. Please try again later.{" "}
            {String(error)}
          </div>
        );
      }

      return <DashboardArticle news={newsData} />;
    }

    // If no user preferences, prompt user to set them
    return <UserPreferenceModel />;
  } catch (error) {
    return (
      <div>
        Something went wrong. Please refresh the page or try again later.{" "}
        {String(error)}
      </div>
    );
  }
};

export default Page;
