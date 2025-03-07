"use client";
import FilterSidebar from "./filterSideBar";
import NewsCard from "./newsCard";
import { useState, useEffect } from "react";
import Loader from "./ui/loader";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import { useRouter, useSearchParams } from "next/navigation";

interface articleSchema {
  title: string;
  link: string;
  snippet: string;
  date: string;
  source: string;
  imageUrl: string;
  position: number;
  description: string,
  category: string;
}

interface ArticlesSchemas {
  message: string;
  data: [articleSchema];
  totalPages: number;
}

export interface DashboardArticleProps {
  news: ArticlesSchemas;
}

export const DashboardArticle: React.FC<DashboardArticleProps> = ({ news }) => {
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const router = useRouter();

  interface HandlePageChangeEvent {
    target: EventTarget;
  }

  const handlePageChange = (event: HandlePageChangeEvent, value: number) => {
    const searchParams = new URLSearchParams();
    if (value) {
      searchParams.set("page", value.toString());
    }
    router.push(`?${searchParams.toString()}`);
  };

  useEffect(() => {
    if (news) {
      setLoading(false);
    }
  }, [news]);
  
  useEffect(() => {
    const page = searchParams.get("page");
    if (page) {
      setCurrentPage(parseInt(page, 10));
    }
  }, [searchParams]);


  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );
  }

  return (
    <div className="">
      <div className="flex justify-center">
        <Stack spacing={2}>
          <Pagination
            count={news?.totalPages}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
            page={currentPage}
          />
        </Stack>
      </div>
      <div className="container mx-auto p-4 grid grid-cols-1 lg:grid-cols-4 gap-4">
        <aside className="md:col-span-1">
          <FilterSidebar />
        </aside>
        <main className="md:col-span-3 space-y-4">
          {news?.data?.length ? (
            news.data.map((article, index) => (
              <NewsCard key={index} {...article} />
            ))
          ) : (
            <div className="text-center text-lg font-semibold text-gray-600">
              No news found
            </div>
          )}
        </main>
      </div>
      <div className="flex justify-center my-2">
        <Stack spacing={2}>
          <Pagination
            count={news?.totalPages}
            variant="outlined"
            shape="rounded"
            onChange={handlePageChange}
            page={currentPage}
          />
        </Stack>
      </div>
    </div>
  );
};
