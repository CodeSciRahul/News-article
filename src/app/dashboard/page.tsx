"use server";

import { fetchUserPrefernce } from "@/lib/fetchers/user-preference";
import { fetchNewsArticle } from "@/lib/fetchers/news-article";
import DashboardArticle from "@/components/dashboardArticle";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { dehydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import UserPreferenceModel from "@/components/model";

const Page = async () => {
  const authData = await auth();
  const token = await authData.getToken();

  if (!token) {
    redirect("/sign-in");
  }

  // Fetch user preferences
  let userPreference;
  try {
    userPreference = await fetchUserPrefernce(token);
  } catch (error) {
    return <div>Error loading preferences</div>;
  }

  if (!userPreference?.data) return <UserPreferenceModel />;

  // ✅ Prefetch News Articles
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["news", { page: 1 }],
    queryFn: () => fetchNewsArticle(token, ""),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <DashboardArticle />
    </HydrationBoundary>
  );
};

export default Page;
