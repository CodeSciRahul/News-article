"use server";

import UserPreferenceModel from "@/components/model";
import { DashboardArticle } from "@/components/dashboardArticle";
import { NextPage } from "next";
import { Alert, AlertTitle } from "@mui/material";
import { fetchUserPrefernce } from "@/lib/fetchers/user-preference";
import { fetchNewsArticle } from "@/lib/fetchers/news-article";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

interface DashboardPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const Page: NextPage<DashboardPageProps> = async ({ searchParams }) => {
  try {
    const resolvedSearchParams = await searchParams;
    const { category, date, title, source, snippet, page } = resolvedSearchParams;

    const authData = await auth();

    // ✅ Redirect to sign-in if not authenticated
    const token = await authData.getToken();
    if (!token) {
      redirect("/sign-in");
      return null; // Ensure no further code executes
    }

    // ✅ Fetch user preferences
    let userPreference;
    try {
      userPreference = await fetchUserPrefernce(token);
    } catch (error) {
      console.error("Error fetching user preferences:", error);
      return (
        <div className="flex justify-center items-center min-h-screen">
          <Alert severity="error" className="max-w-md shadow-lg rounded-2xl">
            <AlertTitle>Failed to Load User Preferences</AlertTitle>
            We were unable to retrieve your preferences. Please check your network connection and try again.
          </Alert>
        </div>
      );
    }

    const data = userPreference?.data;

    if (data) {
      const queryParams = new URLSearchParams(
        Object.entries({
          ...(page && { page: Array.isArray(page) ? page.join(",") : page }),
          ...(category && { category: Array.isArray(category) ? category.join(",") : category }),
          ...(date && { date: Array.isArray(date) ? date.join(",") : date }),
          ...(title && { title: Array.isArray(title) ? title.join(",") : title }),
          ...(source && { source: Array.isArray(source) ? source.join(",") : source }),
          ...(snippet && { snippet: Array.isArray(snippet) ? snippet.join(",") : snippet }),
        })
      ).toString();

      let newsData;
      try {
        newsData = await fetchNewsArticle(token, queryParams);
      } catch (error) {
        console.error("Error fetching news articles:", error);
        return (
          <div className="flex justify-center items-center min-h-screen">
            <Alert severity="error" className="max-w-md shadow-lg rounded-2xl">
              <AlertTitle>Failed to Load News Articles</AlertTitle>
              We encountered an issue while fetching news articles. Please try again later.
            </Alert>
          </div>
        );
      }

      return <DashboardArticle news={newsData} />;
    }

    // ✅ If no user preferences, prompt user to set them
    return <UserPreferenceModel />;
  } catch (error) {
    console.error("Unexpected error:", error);
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert severity="error" className="max-w-md shadow-lg rounded-2xl">
          <AlertTitle>Unexpected Error</AlertTitle>
          Something went wrong. Please refresh the page or try again later.
        </Alert>
      </div>
    );
  }
};

export default Page;
