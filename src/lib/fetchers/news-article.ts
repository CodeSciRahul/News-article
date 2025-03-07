export async function fetchNewsArticle(token: string, queryParams: unknown) {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/news-article?${queryParams}`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` },
    });
  
    return res.json();
  }
  