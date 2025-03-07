"use client";
import FilterSidebar from "./filterSideBar";
import NewsCard from "./newsCard";
import Loader from "./ui/loader";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useSearchParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { fetchNewsArticle } from "@/lib/fetchers/news-article";
import { useAuth } from "@clerk/nextjs";
import { useState } from "react";
import { useEffect } from "react";
import { NewsCardProps } from "./newsCard";

const DashboardArticle = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const page = searchParams.get("page") ? parseInt(searchParams.get("page")!, 10) : 1;
  const { getToken } = useAuth();

  const [queryParams, setqueryParams] = useState<string>('')

  const getQueryParams = (query: string) => {
    setqueryParams(query)
    window.history.replaceState(null, "", `?${queryParams})`) }

  // Use React Query for data fetching
  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["news", { page, queryParams }],
    queryFn: async () => {
      const token = await getToken();
      return fetchNewsArticle(token!, `page=${page}&${queryParams}`);
    },
    staleTime: 30000, // ensure to save data in cached memory for 30 second.
  });
  

  // Handle Page Change
  const handlePageChange = (_: React.ChangeEvent<unknown>, value: number) => {
    const searchParams = new URLSearchParams();
    searchParams.set("page", value.toString());
    window.history.replaceState(null, "", `?${searchParams.toString()}`,) }

  return (
    <div className="">
      <div className="flex justify-center">
        <Stack spacing={2}>
          <Pagination
            count={data?.totalPages || 1}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
            page={page}
          />
        </Stack>
      </div>

      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <aside className="md:col-span-1">
          <FilterSidebar setqueryParams={getQueryParams}/>
        </aside>
        <main className="md:col-span-3 space-y-4">
          {isLoading || isFetching ? (
            <div className="flex justify-center items-center h-64">
              <Loader />
            </div>
          ) : data?.data?.length ? (
            data.data.map((article: NewsCardProps, index: number) => <NewsCard key={index} {...article} />)
          ) : (
            <div className="text-center text-lg font-semibold text-gray-600">No news found</div>
          )}
        </main>
      </div>

      <div className="flex justify-center my-2">
        <Stack spacing={2}>
          <Pagination
            count={data?.totalPages || 1}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
            page={page}
          />
        </Stack>
      </div>
    </div>
  );
};

export default DashboardArticle;
