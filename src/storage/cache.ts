import type { ArticleDetail, CachedArticles } from "@/types/article";

const CACHE_KEY = "qiita_articles_cache_v2";
const CACHE_TTL_MS = 3 * 60 * 60 * 1000; // 3 hours

export async function getCachedArticles(): Promise<CachedArticles | null> {
  const result = await chrome.storage.local.get(CACHE_KEY);
  const cached = result[CACHE_KEY] as CachedArticles | undefined;

  if (!cached) return null;

  const isExpired = Date.now() - cached.cachedAt > CACHE_TTL_MS;
  if (isExpired) {
    await chrome.storage.local.remove(CACHE_KEY);
    return null;
  }

  return cached.articles.length > 0 ? cached : null;
}

export async function setCachedArticles(
  articles: ArticleDetail[],
): Promise<void> {
  if (articles.length === 0) return;

  const cached: CachedArticles = {
    articles,
    cachedAt: Date.now(),
  };
  await chrome.storage.local.set({ [CACHE_KEY]: cached });
}

export async function clearCachedArticles(): Promise<void> {
  await chrome.storage.local.remove(CACHE_KEY);
}
