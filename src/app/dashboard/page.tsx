// agar preference null h to userPreference function return kro jisme post create kro preference create krne ke liye.
// agar preference null nhi h to.
//1. article fetch krne ke liye api call kro.
//2. dashboardArticle function return kro

import { currentUser } from "@clerk/nextjs/server";
import UserPreferenceModel from "@/components/model";
import { DashboardArticle } from "@/components/dashboardArticle";

export default async function Page() {
  const user = await currentUser();
  if (!user) return <div>Loading...</div>;

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/user-preference/${user?.id}`
  );
  const checkUserPreference = await response.json();
  const data = checkUserPreference?.data;

  if (data) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/news-article/${user?.id}`)
    const data = await res.json()
    console.log("news data", data);
    return <DashboardArticle news={data} />;
  }

  return <UserPreferenceModel />

}
