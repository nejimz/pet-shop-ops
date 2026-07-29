"use client";

import { FormEvent, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { useSettings, type AppSettings } from "@/lib/settings";
import { PageHeader } from "@/components/PageHeader";
import { ErrorText } from "@/components/ui";

const CURRENCY_PRESETS = [
  { code: "USD", symbol: "$", label: "USD ($)" },
  { code: "PHP", symbol: "₱", label: "PHP (₱)" },
  { code: "EUR", symbol: "€", label: "EUR (€)" },
  { code: "GBP", symbol: "£", label: "GBP (£)" },
  { code: "JPY", symbol: "¥", label: "JPY (¥)" },
  { code: "CUSTOM", symbol: "", label: "Custom…" },
] as const;

export default function SettingsPage() {
  const { user } = useAuth();
  const { settings, logoSrc, formatMoney, refresh } = useSettings();
  const [appName, setAppName] = useState(settings.appName);
  const [currencyCode, setCurrencyCode] = useState(settings.currencyCode);
  const [currencySymbol, setCurrencySymbol] = useState(settings.currencySymbol);
  const [preset, setPreset] = useState("USD");
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [logoPending, setLogoPending] = useState(false);

  useEffect(() => {
    setAppName(settings.appName);
    setCurrencyCode(settings.currencyCode);
    setCurrencySymbol(settings.currencySymbol);
    const match = CURRENCY_PRESETS.find(
      (p) => p.code === settings.currencyCode && p.symbol === settings.currencySymbol,
    );
    setPreset(match?.code ?? "CUSTOM");
  }, [settings]);

  if (user && user.role !== "ADMIN") {
    return (
      <div className="card p-8 text-center">
        <p className="font-display text-2xl text-brand-900">Admin only</p>
        <p className="mt-2 text-sm text-neutral-600">
          Branding and currency are managed by administrators.
        </p>
      </div>
    );
  }

  function onPresetChange(value: string) {
    setPreset(value);
    const found = CURRENCY_PRESETS.find((p) => p.code === value);
    if (found && found.code !== "CUSTOM") {
      setCurrencyCode(found.code);
      setCurrencySymbol(found.symbol);
    }
  }

  async function onSave(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaved(null);
    setPending(true);
    try {
      await api<AppSettings>("/settings", {
        method: "PATCH",
        body: JSON.stringify({
          appName: appName.trim(),
          currencyCode: currencyCode.trim().toUpperCase(),
          currencySymbol: currencySymbol.trim(),
        }),
      });
      await refresh();
      setSaved("Settings saved.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setPending(false);
    }
  }

  async function onLogoSelected(file: File | null) {
    if (!file) return;
    setError(null);
    setSaved(null);
    setLogoPending(true);
    try {
      const body = new FormData();
      body.append("file", file);
      await api<AppSettings>("/settings/logo", { method: "POST", body });
      await refresh();
      setSaved("Logo updated.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Logo upload failed");
    } finally {
      setLogoPending(false);
    }
  }

  async function onRemoveLogo() {
    setError(null);
    setSaved(null);
    setLogoPending(true);
    try {
      await api("/settings/logo", { method: "DELETE" });
      await refresh();
      setSaved("Logo removed.");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Remove failed");
    } finally {
      setLogoPending(false);
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader
        title="Settings"
        description="Set your shop name, logo, and display currency."
      />

      <ErrorText message={error} />
      {saved ? <p className="text-sm text-emerald-700">{saved}</p> : null}

      <form onSubmit={onSave} className="card space-y-5 p-5">
        <div>
          <h2 className="font-display text-xl text-brand-900">Branding</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Shown in the sidebar and on the sign-in screen.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="label" htmlFor="appName">
              Company / app name
            </label>
            <input
              id="appName"
              className="input"
              value={appName}
              onChange={(e) => setAppName(e.target.value)}
              required
              maxLength={80}
            />
          </div>
          <div>
            <label className="label">Preview</label>
            <div className="flex h-10 items-center gap-3 rounded-xl border border-brand-100 bg-brand-50/50 px-3">
              {logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoSrc} alt="" className="h-7 w-7 rounded object-contain" />
              ) : null}
              <span className="font-display text-lg text-brand-900">{appName || "—"}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="label">Logo</label>
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-xl border border-brand-100 bg-white">
              {logoSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={logoSrc} alt="Logo" className="h-full w-full object-contain" />
              ) : (
                <span className="text-xs text-neutral-400">None</span>
              )}
            </div>
            <label className="btn-ghost cursor-pointer">
              {logoPending ? "Uploading…" : "Upload logo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                className="hidden"
                disabled={logoPending}
                onChange={(e) => onLogoSelected(e.target.files?.[0] ?? null)}
              />
            </label>
            {logoSrc ? (
              <button
                type="button"
                className="btn-quiet"
                disabled={logoPending}
                onClick={() => void onRemoveLogo()}
              >
                Remove
              </button>
            ) : null}
          </div>
          <p className="mt-2 text-xs text-neutral-500">PNG, JPEG, WebP, or SVG · max 2MB</p>
        </div>

        <div className="border-t border-brand-100 pt-5">
          <h2 className="font-display text-xl text-brand-900">Currency</h2>
          <p className="mt-1 text-sm text-neutral-600">
            Display symbol only — amounts in the database stay unchanged.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label className="label" htmlFor="preset">
              Preset
            </label>
            <select
              id="preset"
              className="input"
              value={preset}
              onChange={(e) => onPresetChange(e.target.value)}
            >
              {CURRENCY_PRESETS.map((p) => (
                <option key={p.code} value={p.code}>
                  {p.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label" htmlFor="currencyCode">
              Code
            </label>
            <input
              id="currencyCode"
              className="input"
              value={currencyCode}
              onChange={(e) => {
                setPreset("CUSTOM");
                setCurrencyCode(e.target.value);
              }}
              required
              maxLength={8}
            />
          </div>
          <div>
            <label className="label" htmlFor="currencySymbol">
              Symbol
            </label>
            <input
              id="currencySymbol"
              className="input"
              value={currencySymbol}
              onChange={(e) => {
                setPreset("CUSTOM");
                setCurrencySymbol(e.target.value);
              }}
              required
              maxLength={8}
            />
          </div>
        </div>

        <p className="text-sm text-neutral-600">
          Example: <span className="font-medium text-brand-800">{formatMoney(1234.5)}</span>
        </p>

        <div>
          <button type="submit" className="btn-primary" disabled={pending}>
            {pending ? "Saving…" : "Save settings"}
          </button>
        </div>
      </form>
    </div>
  );
}
