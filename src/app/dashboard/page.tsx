
import { currentUser } from "@clerk/nextjs/server";
import UserPreferenceModel from "@/components/model";
import { DashboardArticle } from "@/components/dashboardArticle";

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

  const user = await currentUser();
  if (!user) return <div>Loading...</div>;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-preference/${user?.id}`
  );
  const checkUserPreference = await response.json();
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
  
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news-article/${user?.id}?${queryParams}`)
    const data = await res.json()
    return <DashboardArticle news={data} />;
  }

  return <UserPreferenceModel />

}
