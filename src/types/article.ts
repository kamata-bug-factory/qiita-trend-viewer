export interface FeedArticle {
  id: string;
  title: string;
  author: string;
  url: string;
  publishedAt: string;
}

export interface ArticleDetail {
  id: string;
  title: string;
  author: string;
  url: string;
  publishedAt: string;
  tags: string[];
  likesCount: number;
}

export interface CachedArticles {
  articles: ArticleDetail[];
  cachedAt: number;
}
