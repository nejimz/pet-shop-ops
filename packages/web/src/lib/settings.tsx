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
import { api } from "./api";

export type AppSettings = {
  id: string;
  appName: string;
  currencyCode: string;
  currencySymbol: string;
  logoUrl: string | null;
  updatedAt?: string;
};

type SettingsContextValue = {
  settings: AppSettings;
  loading: boolean;
  logoSrc: string | null;
  formatMoney: (value: number | string) => string;
  refresh: () => Promise<void>;
};

const DEFAULTS: AppSettings = {
  id: "default",
  appName: "Pet Shop Ops",
  currencyCode: "USD",
  currencySymbol: "$",
  logoUrl: null,
};

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";

const SettingsContext = createContext<SettingsContextValue | null>(null);

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(DEFAULTS);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const data = await api<AppSettings>("/settings");
      setSettings(data);
    } catch {
      /* keep defaults */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.title = settings.appName;
  }, [settings.appName]);

  const logoSrc = useMemo(() => {
    if (!settings.logoUrl) return null;
    if (settings.logoUrl.startsWith("http")) return settings.logoUrl;
    return `${API_URL}${settings.logoUrl}`;
  }, [settings.logoUrl]);

  const formatMoney = useCallback(
    (value: number | string) => {
      const n = Number(value);
      const amount = Number.isFinite(n) ? n.toFixed(2) : "0.00";
      return `${settings.currencySymbol}${amount}`;
    },
    [settings.currencySymbol],
  );

  const value = useMemo(
    () => ({ settings, loading, logoSrc, formatMoney, refresh }),
    [settings, loading, logoSrc, formatMoney, refresh],
  );

  return (
    <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>
  );
}

export function useSettings() {
  const ctx = useContext(SettingsContext);
  if (!ctx) throw new Error("useSettings must be used within SettingsProvider");
  return ctx;
}
