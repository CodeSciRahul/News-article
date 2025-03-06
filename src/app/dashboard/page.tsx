"use server";

import { auth } from "@clerk/nextjs/server";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import DashboardClient from "./dashboardClient";

export default async function DashboardPage({ searchParams }: { searchParams: { [key: string]: string | string[] | undefined } }) {
  const queryClient = new QueryClient();
  const authData = await auth();
  const token = await authData.getToken();

  // Prefetch user preferences
  await queryClient.prefetchQuery({
    queryKey: ["userPreference"],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/user-preference`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to fetch user preferences");
      return res.json();
    },
  });

  //check wheather userPreference exist or not?
  const userPreference = queryClient.getQueryData<{ data?: any }>(["userPreference"]);

  if (userPreference?.data) {
    const queryParams = new URLSearchParams(
      Object.entries(searchParams).reduce((acc, [key, value]) => {
        if (value) acc[key] = Array.isArray(value) ? value.join(",") : value;
        return acc;
      }, {} as Record<string, string>)
    ).toString();

    // Fetch News Articles Only if User Preferences Exist
    await queryClient.prefetchQuery({
      queryKey: ["news", queryParams],
      queryFn: async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news-article?${queryParams}`, {
          method: "GET",
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) throw new Error("Failed to fetch news articles");
        return res.json();
      },
    });
  }


  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>
      <DashboardClient searchParams={searchParams} token={token} />
    </HydrationBoundary>
  );
}
