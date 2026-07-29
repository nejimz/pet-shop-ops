"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/lib/auth";
import { useSettings } from "@/lib/settings";

const NAV = [
  { href: "/", label: "Dashboard" },
  { href: "/owners", label: "Owners" },
  { href: "/pets", label: "Pets" },
  { href: "/appointments", label: "Appointments" },
  { href: "/products", label: "Products" },
  { href: "/sales", label: "Sales" },
  { href: "/reports", label: "Reports" },
  { href: "/staff", label: "Staff", adminOnly: true },
  { href: "/settings", label: "Settings", adminOnly: true },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading, logout } = useAuth();
  const { settings, logoSrc } = useSettings();

  if (pathname === "/login") return <>{children}</>;

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="animate-fade-in text-sm tracking-wide text-neutral-500">
          Loading workspace…
        </p>
      </div>
    );
  }

  const items = NAV.filter((item) => !("adminOnly" in item && item.adminOnly) || user.role === "ADMIN");

  return (
    <div className="min-h-screen lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="relative flex flex-col border-b border-brand-800/40 bg-brand-900 text-white lg:min-h-screen lg:border-b-0 lg:border-r lg:border-brand-800/60">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(61,122,92,0.45) 0%, transparent 60%)",
          }}
        />
        <div className="relative px-6 pb-4 pt-7">
          <div className="flex items-center gap-3">
            {logoSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={logoSrc}
                alt=""
                className="h-10 w-10 rounded-lg bg-white/10 object-contain p-1"
              />
            ) : null}
            <p className="font-display text-[1.65rem] leading-none tracking-tight">
              {settings.appName}
            </p>
          </div>
          <p className="mt-2 text-[11px] font-medium uppercase tracking-[0.14em] text-brand-200/70">
            Consultations · Records · Sales
          </p>
        </div>

        <nav className="relative flex gap-1 overflow-x-auto px-3 pb-4 lg:mt-2 lg:flex-1 lg:flex-col lg:gap-0.5 lg:px-3">
          {items.map((item) => {
            const active = isActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={[
                  "group relative whitespace-nowrap rounded-xl px-3.5 py-2.5 text-sm transition duration-200",
                  active
                    ? "bg-white/12 font-medium text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]"
                    : "text-white/65 hover:bg-white/[0.07] hover:text-white",
                ].join(" ")}
              >
                <span
                  className={[
                    "absolute left-1 top-1/2 hidden h-5 w-0.5 -translate-y-1/2 rounded-full bg-brand-300 transition lg:block",
                    active ? "opacity-100" : "opacity-0 group-hover:opacity-40",
                  ].join(" ")}
                />
                <span className="lg:pl-2">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="relative mt-auto hidden border-t border-white/10 px-6 py-5 lg:block">
          <p className="text-sm font-medium tracking-tight">{user.name}</p>
          <p className="mt-0.5 text-[11px] uppercase tracking-[0.12em] text-white/45">
            {user.role}
          </p>
          <button
            type="button"
            onClick={logout}
            className="mt-4 text-xs text-brand-200/80 underline decoration-brand-200/30 underline-offset-4 transition hover:text-white"
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className="relative px-4 py-7 sm:px-8 lg:px-10 lg:py-9">
        <div className="mx-auto max-w-6xl module-enter">{children}</div>
      </main>
    </div>
  );
}
