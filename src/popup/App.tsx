import { useEffect } from "react";
import { useToken } from "@/hooks/useToken";
import { useArticles } from "@/hooks/useArticles";
import { TokenForm } from "./components/TokenForm";
import { ArticleList } from "./components/ArticleList";
import { Header } from "./components/Header";
import { Skeleton } from "@/components/ui/skeleton";

export function App() {
  const { token, loading: tokenLoading, saveToken, clearToken } = useToken();
  const {
    articles,
    loading,
    error,
    cachedAt,
    fetch: fetchArticles,
    refetch,
  } = useArticles();

  useEffect(() => {
    if (token) {
      fetchArticles(token);
    }
  }, [token, fetchArticles]);

  const handleRefresh = () => {
    if (token) refetch(token);
  };

  if (tokenLoading) {
    return (
      <div className="w-[400px] min-h-[500px] flex items-center justify-center">
        <Skeleton className="h-6 w-32" />
      </div>
    );
  }

  if (!token) {
    return (
      <div className="w-[400px] min-h-[500px] flex flex-col">
        <Header />
        <div className="flex flex-1 items-center justify-center">
          <TokenForm onSubmit={saveToken} />
        </div>
      </div>
    );
  }

  return (
    <div className="w-[400px] min-h-[500px] flex flex-col">
      <Header onRefresh={handleRefresh} onLogout={clearToken} cachedAt={cachedAt} />
      <div className="flex-1 overflow-y-auto">
        <ArticleList
          articles={articles}
          loading={loading}
          error={error}
          onRefresh={handleRefresh}
        />
      </div>
    </div>
  );
}
