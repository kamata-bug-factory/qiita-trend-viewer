import type { FeedArticle } from "@/types/article";

const FEED_URL = "https://qiita.com/popular-items/feed";
const ATOM_NS = "http://www.w3.org/2005/Atom";
const MAX_ARTICLES = 10;

export async function fetchTrendFeed(): Promise<FeedArticle[]> {
  const response = await fetch(FEED_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch feed: ${response.status}`);
  }

  const text = await response.text();
  const parser = new DOMParser();
  const doc = parser.parseFromString(text, "application/xml");

  const entries = doc.getElementsByTagNameNS(ATOM_NS, "entry");
  const articles: FeedArticle[] = [];

  for (const entry of Array.from(entries).slice(0, MAX_ARTICLES)) {
    const title =
      entry.getElementsByTagNameNS(ATOM_NS, "title")[0]?.textContent ?? "";

    const links = entry.getElementsByTagNameNS(ATOM_NS, "link");
    const rawUrl = findAlternateLink(links);
    const url = stripUtmParams(rawUrl);

    const authorEl = entry.getElementsByTagNameNS(ATOM_NS, "author")[0];
    const author =
      authorEl?.getElementsByTagNameNS(ATOM_NS, "name")[0]?.textContent ?? "";

    const id = extractArticleId(url);
    if (!id) continue;

    articles.push({ id, title, author, url });
  }

  return articles;
}

function findAlternateLink(links: HTMLCollectionOf<Element>): string {
  for (const link of Array.from(links)) {
    if (link.getAttribute("rel") === "alternate") {
      return link.getAttribute("href") ?? "";
    }
  }
  return Array.from(links)[0]?.getAttribute("href") ?? "";
}

function extractArticleId(url: string): string | null {
  const match = url.match(/\/items\/([a-zA-Z0-9]+)/);
  return match?.[1] ?? null;
}

function stripUtmParams(url: string): string {
  try {
    const parsed = new URL(url);
    for (const key of [...parsed.searchParams.keys()]) {
      if (key.startsWith("utm_")) {
        parsed.searchParams.delete(key);
      }
    }
    return parsed.toString();
  } catch {
    return url;
  }
}
