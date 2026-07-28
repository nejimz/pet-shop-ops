"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, ErrorText, StatusPill } from "@/components/ui";

type DashboardData = {
  todayAppointments: number;
  ownerCount: number;
  petCount: number;
  recentSales: Array<{
    id: string;
    buyer: string;
    items: string[];
    total: number;
    status: string;
  }>;
};

const KPIS = [
  {
    key: "todayAppointments" as const,
    label: "Today scheduled",
    href: "/appointments",
    link: "View appointments",
  },
  {
    key: "ownerCount" as const,
    label: "Owners",
    href: "/owners",
    link: "Browse owners",
  },
  {
    key: "petCount" as const,
    label: "Active pets",
    href: "/pets",
    link: "Browse pets",
  },
];

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<DashboardData>("/dashboard")
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed"));
  }, []);

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Today’s appointments and recent sales at a glance."
      />
      <ErrorText message={error} />

      <div className="grid gap-4 sm:grid-cols-3">
        {KPIS.map((kpi, i) => (
          <div
            key={kpi.key}
            className="card group p-6 transition duration-300 hover:-translate-y-0.5"
            style={{ animationDelay: `${i * 60}ms` }}
          >
            <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
              {kpi.label}
            </p>
            <p className="mt-3 font-display text-4xl tracking-tight text-brand-700">
              {data ? data[kpi.key] : "—"}
            </p>
            <Link
              href={kpi.href}
              className="mt-4 inline-block text-sm text-brand-600 underline decoration-brand-200 underline-offset-4 transition group-hover:text-brand-800"
            >
              {kpi.link}
            </Link>
          </div>
        ))}
      </div>

      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-brand-100/80 px-5 py-4">
          <h2 className="font-display text-xl text-brand-900">Recent sales</h2>
          <Link href="/sales" className="btn-quiet">
            Open sales
          </Link>
        </div>
        {!data ? (
          <EmptyState message="Loading sales…" />
        ) : data.recentSales.length === 0 ? (
          <EmptyState message="No recent sales yet." />
        ) : (
          <ul className="divide-y divide-neutral-100">
            {data.recentSales.map((sale) => (
              <li
                key={sale.id}
                className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
              >
                <div>
                  <p className="font-medium text-brand-900">{sale.buyer}</p>
                  <p className="mt-0.5 text-sm text-neutral-500">
                    {sale.items.join(", ") || "—"}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusPill tone={sale.status === "VOIDED" ? "bad" : "good"}>
                    {sale.status}
                  </StatusPill>
                  <p className="font-display text-lg text-brand-800">
                    ${Number(sale.total).toFixed(2)}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
