import { useCallback, useEffect, useState } from "react";
import { getToken, setToken, removeToken } from "@/storage/token";

export function useToken() {
  const [token, setTokenState] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getToken().then((t) => {
      setTokenState(t);
      setLoading(false);
    });
  }, []);

  const saveToken = useCallback(async (newToken: string) => {
    await setToken(newToken);
    setTokenState(newToken);
  }, []);

  const clearToken = useCallback(async () => {
    await removeToken();
    setTokenState(null);
  }, []);

  return { token, loading, saveToken, clearToken };
}
