import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export function useAuth() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 初回マウント時に /api/user を叩いてユーザー情報を取得
  useEffect(() => {
    let cancelled = false;

    async function loadUser() {
      try {
        const res = await axios.get("http://localhost:8080/api/user");
        if (!cancelled) {
          setUser(res.data);
        }
      } catch {
        // 401 などが返ってきたら「未ログイン」とみなす
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadUser();

    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email, password) => {
    // CSRF Cookie 取得
    await axios.get("http://localhost:8080/sanctum/csrf-cookie");
    // ログイン
    const res = await axios.post("http://localhost:8080/api/login", { email, password });
    // ユーザー情報を再取得
    const userRes = await axios.get("http://localhost:8080/api/user");
    setUser(userRes.data);
    return res.data;
  }, []);

  const logout = useCallback(async () => {
    await axios.post("http://localhost:8080/api/logout");
    setUser(null);
  }, []);

  return { user, loading, isLoggedIn: !!user, login, logout };
}
