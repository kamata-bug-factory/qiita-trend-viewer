import type { FeedArticle, ArticleDetail } from "@/types/article";

const API_BASE = "https://qiita.com/api/v2";

interface QiitaItemResponse {
  likes_count: number;
  tags: { name: string }[];
}

export async function fetchArticleDetail(
  feedArticle: FeedArticle,
  token: string,
): Promise<ArticleDetail> {
  const response = await fetch(`${API_BASE}/items/${feedArticle.id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`API error: ${response.status}`);
  }

  const data = (await response.json()) as QiitaItemResponse;

  return {
    id: feedArticle.id,
    title: feedArticle.title,
    author: feedArticle.author,
    url: feedArticle.url,
    publishedAt: feedArticle.publishedAt,
    tags: data.tags.map((t) => t.name),
    likesCount: data.likes_count,
  };
}

export async function fetchAllArticleDetails(
  feedArticles: FeedArticle[],
  token: string,
): Promise<ArticleDetail[]> {
  const results = await Promise.all(
    feedArticles.map((article) => fetchArticleDetail(article, token)),
  );
  return results;
}
