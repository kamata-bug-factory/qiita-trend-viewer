import { useCallback, useState } from "react";
import type { ArticleDetail } from "@/types/article";
import {
  getCachedArticles,
  setCachedArticles,
  clearCachedArticles,
} from "@/storage/cache";
import { fetchTrendFeed } from "@/services/feed";
import { fetchAllArticleDetails } from "@/services/api";

interface UseArticlesResult {
  articles: ArticleDetail[];
  loading: boolean;
  error: string | null;
  cachedAt: number | null;
  fetch: (token: string) => void;
  refetch: (token: string) => void;
}

async function fetchFromNetwork(token: string): Promise<ArticleDetail[]> {
  const feedArticles = await fetchTrendFeed();
  const details = await fetchAllArticleDetails(feedArticles, token);
  await setCachedArticles(details);
  return details;
}

export function useArticles(): UseArticlesResult {
  const [articles, setArticles] = useState<ArticleDetail[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cachedAt, setCachedAt] = useState<number | null>(null);

  const fetchArticles = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      const cached = await getCachedArticles();
      if (cached) {
        setArticles(cached.articles);
        setCachedAt(cached.cachedAt);
        setLoading(false);
        return;
      }

      const details = await fetchFromNetwork(token);
      setArticles(details);
      setCachedAt(Date.now());
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  const refetchArticles = useCallback(async (token: string) => {
    setLoading(true);
    setError(null);

    try {
      await clearCachedArticles();
      const details = await fetchFromNetwork(token);
      setArticles(details);
      setCachedAt(Date.now());
    } catch (e) {
      const message = e instanceof Error ? e.message : "Unknown error";
      setError(message);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    articles,
    loading,
    error,
    cachedAt,
    fetch: fetchArticles,
    refetch: refetchArticles,
  };
}
