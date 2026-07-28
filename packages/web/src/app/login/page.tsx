"use client";

import { FormEvent, useState } from "react";
import { useAuth } from "@/lib/auth";
import { ErrorText } from "@/components/ui";

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("admin@petshop.local");
  const [password, setPassword] = useState("password123");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setPending(true);
    setError(null);
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Sign in failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 60% at 20% 20%, #dceee6 0%, transparent 55%), radial-gradient(ellipse 70% 50% at 90% 80%, #c8ddd2 0%, transparent 50%), #eef3f0",
        }}
      />
      <form
        onSubmit={onSubmit}
        className="relative w-full max-w-md animate-fade-up rounded-2xl border border-brand-100/80 bg-white/95 p-8 shadow-soft backdrop-blur"
      >
        <p className="font-display text-3xl tracking-tight text-brand-900">
          Pet Shop Ops
        </p>
        <p className="mt-2 text-sm leading-relaxed text-neutral-600">
          Sign in to manage consultations, pets, and sales.
        </p>

        <div className="mt-8 space-y-4">
          <div>
            <label className="label" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              className="input"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label" htmlFor="password">
              Password
            </label>
            <input
              id="password"
              className="input"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <ErrorText message={error} />
          <button type="submit" className="btn-primary w-full" disabled={pending}>
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </div>
        <p className="mt-5 text-xs text-neutral-500">
          Seed: admin@petshop.local / password123
        </p>
      </form>
    </div>
  );
}
