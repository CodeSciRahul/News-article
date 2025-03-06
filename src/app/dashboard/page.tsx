
import { auth } from "@clerk/nextjs/server";
import UserPreferenceModel from "@/components/model";
import { DashboardArticle } from "@/components/dashboardArticle";
import { headers } from "next/headers";
import { checkCustomRoutes } from "next/dist/lib/load-custom-routes";

interface searchParamsSchema {
  category: string | undefined,
  date: string | undefined,
  source: string | undefined,
  snippet: string | undefined,
  page: string| undefined,
  title: string| undefined
}

export default async function Page({searchParams}: {searchParams: searchParamsSchema}) {
  const {category, date, title, source, snippet, page} = await searchParams

  const {userId} = await auth();
  if (!userId) return <div>Loading...</div>;
  const authData = await auth(); // Get authentication data
  const token = await authData.getToken(); // Retrieve token

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-preference`,
    {
      method: "GET",
      headers: {
        'Authorization': `Bearer ${token}`
      }
    }
  );
  const checkUserPreference = await response.json();
  console.log("respone ",checkCustomRoutes)
  const data = checkUserPreference?.data;



  if (data) {
    const queryParams = new URLSearchParams({
      ...(page && {page}),
      ...(category && { category }),
      ...(date && { date }),
      ...(title && { title }),
      ...(source && { source }),
      ...(snippet && { snippet }),
    }).toString();
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news-article/?${queryParams}`)
    const data = await res.json()
    return <DashboardArticle news={data} />;
  }

  return <UserPreferenceModel />

}
