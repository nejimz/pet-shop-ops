"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, ErrorText, StatusPill } from "@/components/ui";

type AppointmentRow = {
  id: string;
  startsAt: string;
  type: string;
  owner: { id: string; name: string };
  pet: { id: string; name: string };
};

type FollowUpRow = {
  id: string;
  followUpAt: string;
  owner: { id: string; name: string };
  pet: { id: string; name: string };
};

type LowStockRow = {
  id: string;
  name: string;
  sku: string;
  stockQty: number;
};

type DashboardData = {
  todayAppointments: number;
  todayRevenue: number;
  todaySalesCount: number;
  ownerCount: number;
  petCount: number;
  upcomingAppointments: AppointmentRow[];
  overdueAppointments: AppointmentRow[];
  followUpsDue: FollowUpRow[];
  lowStockProducts: LowStockRow[];
  recentSales: Array<{
    id: string;
    buyer: string;
    items: string[];
    total: number;
    status: string;
    occurredAt: string;
  }>;
};

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export default function DashboardPage() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<DashboardData>("/dashboard")
      .then(setData)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed"));
  }, []);

  const followUpCount = data?.followUpsDue.length ?? 0;

  return (
    <div className="space-y-8">
      <PageHeader
        title="Dashboard"
        description="Today’s schedule, sales, and items that need attention."
      />
      <ErrorText message={error} />

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="card group p-6 transition duration-300 hover:-translate-y-0.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
            Today scheduled
          </p>
          <p className="mt-3 font-display text-4xl tracking-tight text-brand-700">
            {data ? data.todayAppointments : "—"}
          </p>
          <Link
            href="/appointments"
            className="mt-4 inline-block text-sm text-brand-600 underline decoration-brand-200 underline-offset-4 transition group-hover:text-brand-800"
          >
            View appointments
          </Link>
        </div>

        <div className="card group p-6 transition duration-300 hover:-translate-y-0.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
            Today revenue
          </p>
          <p className="mt-3 font-display text-4xl tracking-tight text-brand-700">
            {data ? `$${Number(data.todayRevenue).toFixed(2)}` : "—"}
          </p>
          <Link
            href="/sales"
            className="mt-4 inline-block text-sm text-brand-600 underline decoration-brand-200 underline-offset-4 transition group-hover:text-brand-800"
          >
            Open sales
          </Link>
        </div>

        <div className="card group p-6 transition duration-300 hover:-translate-y-0.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
            Sales today
          </p>
          <p className="mt-3 font-display text-4xl tracking-tight text-brand-700">
            {data ? data.todaySalesCount : "—"}
          </p>
          <Link
            href="/sales"
            className="mt-4 inline-block text-sm text-brand-600 underline decoration-brand-200 underline-offset-4 transition group-hover:text-brand-800"
          >
            Open sales
          </Link>
        </div>

        <div className="card group p-6 transition duration-300 hover:-translate-y-0.5">
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
            Follow-ups due
          </p>
          <p className="mt-3 font-display text-4xl tracking-tight text-brand-700">
            {data ? followUpCount : "—"}
          </p>
          <a
            href="#follow-ups"
            className="mt-4 inline-block text-sm text-brand-600 underline decoration-brand-200 underline-offset-4 transition group-hover:text-brand-800"
          >
            Review follow-ups
          </a>
        </div>
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card overflow-hidden">
          <div className="flex items-center justify-between border-b border-brand-100/80 px-5 py-4">
            <h2 className="font-display text-xl text-brand-900">Upcoming today</h2>
            <Link href="/appointments" className="btn-quiet">
              All appointments
            </Link>
          </div>
          {!data ? (
            <EmptyState message="Loading appointments…" />
          ) : data.upcomingAppointments.length === 0 ? (
            <EmptyState message="No more appointments scheduled for today." />
          ) : (
            <ul className="divide-y divide-neutral-100">
              {data.upcomingAppointments.map((appt) => (
                <li
                  key={appt.id}
                  className="flex flex-wrap items-center justify-between gap-3 px-5 py-4"
                >
                  <div>
                    <p className="font-medium text-brand-900">
                      <Link
                        href={`/owners/${appt.owner.id}`}
                        className="hover:text-brand-600"
                      >
                        {appt.owner.name}
                      </Link>
                      <span className="mx-1.5 text-neutral-300">·</span>
                      <Link
                        href={`/pets/${appt.pet.id}`}
                        className="font-normal text-neutral-600 hover:text-brand-600"
                      >
                        {appt.pet.name}
                      </Link>
                    </p>
                    <p className="mt-0.5 text-sm text-neutral-500">
                      {formatTime(appt.startsAt)}
                    </p>
                  </div>
                  <StatusPill tone="neutral">{appt.type}</StatusPill>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="space-y-4">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between border-b border-brand-100/80 px-5 py-4">
              <h2 className="font-display text-xl text-brand-900">Needs attention</h2>
              <Link href="/appointments" className="btn-quiet">
                Appointments
              </Link>
            </div>

            {!data ? (
              <EmptyState message="Loading…" />
            ) : (
              <div className="divide-y divide-neutral-100">
                <div className="px-5 py-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-amber-700">
                    Overdue appointments
                  </p>
                  {data.overdueAppointments.length === 0 ? (
                    <p className="mt-2 text-sm text-neutral-500">None overdue.</p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {data.overdueAppointments.map((appt) => (
                        <li key={appt.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                          <span>
                            <Link
                              href={`/owners/${appt.owner.id}`}
                              className="font-medium text-brand-900 hover:text-brand-600"
                            >
                              {appt.owner.name}
                            </Link>
                            <span className="text-neutral-400"> / </span>
                            <Link
                              href={`/pets/${appt.pet.id}`}
                              className="text-neutral-600 hover:text-brand-600"
                            >
                              {appt.pet.name}
                            </Link>
                            <span className="ml-2 text-neutral-500">
                              {formatDateTime(appt.startsAt)}
                            </span>
                          </span>
                          <StatusPill tone="warn">{appt.type}</StatusPill>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div id="follow-ups" className="px-5 py-4 scroll-mt-6">
                  <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-brand-700">
                    Follow-ups due
                  </p>
                  {data.followUpsDue.length === 0 ? (
                    <p className="mt-2 text-sm text-neutral-500">No follow-ups due.</p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {data.followUpsDue.map((fu) => (
                        <li key={fu.id} className="flex flex-wrap items-center justify-between gap-2 text-sm">
                          <span>
                            <Link
                              href={`/owners/${fu.owner.id}`}
                              className="font-medium text-brand-900 hover:text-brand-600"
                            >
                              {fu.owner.name}
                            </Link>
                            <span className="text-neutral-400"> / </span>
                            <Link
                              href={`/pets/${fu.pet.id}`}
                              className="text-neutral-600 hover:text-brand-600"
                            >
                              {fu.pet.name}
                            </Link>
                          </span>
                          <span className="text-neutral-500">
                            {formatDateTime(fu.followUpAt)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className="px-5 py-4">
                  <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-red-700">
                    Low stock
                  </p>
                  {data.lowStockProducts.length === 0 ? (
                    <p className="mt-2 text-sm text-neutral-500">Stock looks healthy.</p>
                  ) : (
                    <ul className="mt-3 space-y-2">
                      {data.lowStockProducts.map((p) => (
                        <li
                          key={p.id}
                          className="flex flex-wrap items-center justify-between gap-2 text-sm"
                        >
                          <Link
                            href={`/products/${p.id}`}
                            className="font-medium text-brand-900 hover:text-brand-600"
                          >
                            {p.name}
                            <span className="ml-2 font-mono text-xs font-normal text-neutral-500">
                              {p.sku}
                            </span>
                          </Link>
                          <StatusPill tone={p.stockQty === 0 ? "bad" : "warn"}>
                            {p.stockQty} left
                          </StatusPill>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            )}
          </div>
        </section>
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
                  <p className="mt-1 text-xs text-neutral-400">
                    {formatDateTime(sale.occurredAt)}
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
