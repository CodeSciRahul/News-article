"use client"

interface articleSchema {
    title: string;
    link: string;
    snippet: string;
    date: string;
    source: string;
    imageUrl: string;
    position: number;
  }
  
  interface ArticlesSchemas {
    message: string,
    data: [articleSchema];
  }
export function DashboardArticle({ news }: { news: ArticlesSchemas }) {
  return (
    <>
    {news?.data.map((n,index) => {
        return <div  key={index} className="text-black">{n?.title}</div>
    })}
    </>
  );
}