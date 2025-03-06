"use client";

import { useQuery } from "@tanstack/react-query";
import { Alert, AlertTitle } from "@mui/material";
import { useSearchParams } from "next/navigation";
import UserPreferenceModel from "@/components/model";
import { DashboardArticle } from "@/components/dashboardArticle";

export default function DashboardClient({ searchParams, token }: { searchParams: { [key: string]: string | string[] | undefined }; token: string }) {
  const { data: userPreference, error: userPrefError } = useQuery({
    queryKey: ["userPreference"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-preference`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch user preferences");
      return res.json();
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  if (userPrefError) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Alert severity="error" className="max-w-md shadow-lg rounded-2xl">
          <AlertTitle>Connection Error</AlertTitle>
          Unable to fetch user preferences. Please ensure your Docker instance is running.
        </Alert>
      </div>
    );
  }

  const data = userPreference?.data;

  // If no user preferences, prompt user to set them
  if (!data) {
    return <UserPreferenceModel />;
  }

  // Fetch news articles based on user preferences
  const queryParams = new URLSearchParams(
    Object.entries({
      ...(searchParams.page && { page: Array.isArray(searchParams.page) ? searchParams.page.join(",") : searchParams.page }),
      ...(searchParams.category && { category: Array.isArray(searchParams.category) ? searchParams.category.join(",") : searchParams.category }),
      ...(searchParams.date && { date: Array.isArray(searchParams.date) ? searchParams.date.join(",") : searchParams.date }),
      ...(searchParams.title && { title: Array.isArray(searchParams.title) ? searchParams.title.join(",") : searchParams.title }),
      ...(searchParams.source && { source: Array.isArray(searchParams.source) ? searchParams.source.join(",") : searchParams.source }),
      ...(searchParams.snippet && { snippet: Array.isArray(searchParams.snippet) ? searchParams.snippet.join(",") : searchParams.snippet }),
    })
  ).toString();

   // Use Prefetched News Articles
   const { data: newsData, error: newsError, isFetching } = useQuery({
    queryKey: ["news", queryParams],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news-article?${queryParams}`, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch news articles");
      return res.json();
    },
    enabled: !!queryParams,
  });


  if (newsError) {
    return (
      <div className="flex justify-center items-center text-2xl">
        Error fetching news articles. Please try again later. {String(newsError)}
      </div>
    );
  }

  return <DashboardArticle news={newsData} />;
}
