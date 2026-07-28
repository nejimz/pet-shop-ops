"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { api } from "./api";

export type AuthUser = {
  id: string;
  email: string;
  name: string;
  role: "ADMIN" | "STAFF";
};

type AuthContextValue = {
  user: AuthUser | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setAuth: (token: string, user: AuthUser) => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function setAuthStorage(token: string, user: AuthUser) {
  localStorage.setItem("petshop_token", token);
  localStorage.setItem("petshop_user", JSON.stringify(user));
}

function clearAuthStorage() {
  localStorage.removeItem("petshop_token");
  localStorage.removeItem("petshop_user");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const setAuth = useCallback((token: string, next: AuthUser) => {
    setAuthStorage(token, next);
    setUser(next);
  }, []);

  const logout = useCallback(() => {
    clearAuthStorage();
    setUser(null);
    router.replace("/login");
  }, [router]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api<{ accessToken: string; user: AuthUser }>(
        "/auth/login",
        {
          method: "POST",
          body: JSON.stringify({ email, password }),
        },
      );
      setAuth(data.accessToken, data.user);
      router.replace("/");
    },
    [router, setAuth],
  );

  useEffect(() => {
    let cancelled = false;
    async function boot() {
      const token = localStorage.getItem("petshop_token");
      const raw = localStorage.getItem("petshop_user");
      if (!token || !raw) {
        if (pathname !== "/login") router.replace("/login");
        if (!cancelled) setLoading(false);
        return;
      }
      try {
        const cached = JSON.parse(raw) as AuthUser;
        if (!cancelled) setUser(cached);
        const me = await api<AuthUser>("/auth/me");
        if (!cancelled) setAuth(token, me);
      } catch {
        clearAuthStorage();
        if (!cancelled) {
          setUser(null);
          router.replace("/login");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    void boot();
    return () => {
      cancelled = true;
    };
  }, [pathname, router, setAuth]);

  const value = useMemo(
    () => ({ user, loading, login, logout, setAuth }),
    [user, loading, login, logout, setAuth],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
