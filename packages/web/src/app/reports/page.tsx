"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useSettings } from "@/lib/settings";
import { PageHeader } from "@/components/PageHeader";
import { ReportCharts, type ReportChartsData } from "@/components/ReportCharts";
import { EmptyState, ErrorText, Pagination, StatusPill } from "@/components/ui";

const PAGE_SIZE = 50;

type SaleLine = {
  quantity: number;
  unitPrice?: number | string;
  product?: { id: string; name: string; sku?: string };
};

type Transaction = {
  id: string;
  total: number | string;
  status: string;
  paymentMethod: string;
  occurredAt: string;
  walkInName?: string | null;
  owner?: { id: string; name: string } | null;
  pet?: { id: string; name: string } | null;
  soldBy?: { id: string; name: string } | null;
  lines?: SaleLine[];
};

type ReportResponse = {
  items: Transaction[];
  total: number;
  page: number;
  pageSize: number;
  summary: {
    count: number;
    completedCount: number;
    voidedCount: number;
    revenue: number;
  };
  charts: ReportChartsData;
};

function toDateInput(d: Date) {
  return d.toISOString().slice(0, 10);
}

function defaultFrom() {
  const d = new Date();
  d.setDate(d.getDate() - 30);
  return toDateInput(d);
}

function defaultTo() {
  return toDateInput(new Date());
}

function statusTone(status: string) {
  if (status === "COMPLETED") return "good" as const;
  if (status === "VOIDED") return "bad" as const;
  return "neutral" as const;
}

export default function ReportsPage() {
  const { formatMoney } = useSettings();
  const [from, setFrom] = useState(defaultFrom);
  const [to, setTo] = useState(defaultTo);
  const [status, setStatus] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [q, setQ] = useState("");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ReportResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async (nextPage: number) => {
    setError(null);
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (from) {
        const start = new Date(from);
        start.setHours(0, 0, 0, 0);
        params.set("from", start.toISOString());
      }
      if (to) {
        const end = new Date(to);
        end.setHours(23, 59, 59, 999);
        params.set("to", end.toISOString());
      }
      if (status) params.set("status", status);
      if (paymentMethod) params.set("paymentMethod", paymentMethod);
      if (q.trim()) params.set("q", q.trim());
      params.set("page", String(nextPage));
      params.set("pageSize", String(PAGE_SIZE));

      const res = await api<ReportResponse>(`/reports/transactions?${params.toString()}`);
      setData(res);
      setPage(res.page);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load report");
      setData(null);
    } finally {
      setLoading(false);
    }
  }, [from, to, status, paymentMethod, q]);

  useEffect(() => {
    void load(1);
    // Mount only — subsequent loads via Apply / pagination
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function onApply(e?: FormEvent) {
    e?.preventDefault();
    await load(1);
  }

  async function onPage(next: number) {
    await load(next);
  }

  const summary = data?.summary;
  const items = data?.items ?? [];

  return (
    <div className="space-y-7">
      <PageHeader
        title="Reports"
        description="Browse all sales transactions with filters and revenue totals."
      />

      <form
        onSubmit={onApply}
        className="card grid gap-3 p-5 sm:grid-cols-2 lg:grid-cols-6"
      >
        <div>
          <label className="label" htmlFor="from">
            From
          </label>
          <input
            id="from"
            type="date"
            className="input"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="to">
            To
          </label>
          <input
            id="to"
            type="date"
            className="input"
            value={to}
            onChange={(e) => setTo(e.target.value)}
          />
        </div>
        <div>
          <label className="label" htmlFor="status">
            Status
          </label>
          <select
            id="status"
            className="input"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="">All</option>
            <option value="COMPLETED">COMPLETED</option>
            <option value="VOIDED">VOIDED</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="paymentMethod">
            Payment
          </label>
          <select
            id="paymentMethod"
            className="input"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
          >
            <option value="">All</option>
            <option value="CASH">CASH</option>
            <option value="CARD">CARD</option>
            <option value="OTHER">OTHER</option>
          </select>
        </div>
        <div>
          <label className="label" htmlFor="q">
            Search
          </label>
          <input
            id="q"
            className="input"
            placeholder="Buyer or product…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
          />
        </div>
        <div className="flex items-end">
          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading ? "Loading…" : "Apply"}
          </button>
        </div>
      </form>

      <ErrorText message={error} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
            Completed
          </p>
          <p className="mt-2 font-display text-3xl tracking-tight text-brand-800">
            {summary ? summary.completedCount : "—"}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
            Voided
          </p>
          <p className="mt-2 font-display text-3xl tracking-tight text-brand-800">
            {summary ? summary.voidedCount : "—"}
          </p>
        </div>
        <div className="card p-5">
          <p className="text-[11px] font-medium uppercase tracking-[0.1em] text-neutral-500">
            Revenue
          </p>
          <p className="mt-2 font-display text-3xl tracking-tight text-brand-800">
            {summary ? formatMoney(summary.revenue) : "—"}
          </p>
        </div>
      </div>

      <ReportCharts charts={data?.charts} loading={loading && !data} formatMoney={formatMoney} />

      <div className="card overflow-hidden">
        {loading && !data ? (
          <EmptyState message="Loading transactions…" />
        ) : items.length === 0 ? (
          <EmptyState message="No transactions match these filters." />
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Buyer</th>
                  <th>Pet</th>
                  <th>Items</th>
                  <th>Payment</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th>Sold by</th>
                </tr>
              </thead>
              <tbody>
                {items.map((sale) => {
                  const buyer = sale.owner?.name || sale.walkInName || "—";
                  const itemsLabel =
                    sale.lines
                      ?.map((l) => `${l.product?.name ?? "Item"}×${l.quantity}`)
                      .join(", ") || "—";

                  return (
                    <tr key={sale.id}>
                      <td className="whitespace-nowrap text-neutral-600">
                        {new Date(sale.occurredAt).toLocaleString()}
                      </td>
                      <td className="font-medium text-brand-900">
                        {sale.owner ? (
                          <Link
                            href={`/owners/${sale.owner.id}`}
                            className="hover:text-brand-600"
                          >
                            {buyer}
                          </Link>
                        ) : (
                          buyer
                        )}
                      </td>
                      <td className="text-neutral-600">
                        {sale.pet ? (
                          <Link
                            href={`/pets/${sale.pet.id}`}
                            className="hover:text-brand-600"
                          >
                            {sale.pet.name}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="max-w-[16rem] truncate text-neutral-600" title={itemsLabel}>
                        {itemsLabel}
                      </td>
                      <td className="text-neutral-600">{sale.paymentMethod}</td>
                      <td className="tabular-nums text-brand-900">
                        {formatMoney(sale.total)}
                      </td>
                      <td>
                        <StatusPill tone={statusTone(sale.status)}>{sale.status}</StatusPill>
                      </td>
                      <td className="text-neutral-600">{sale.soldBy?.name || "—"}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="border-t border-brand-100 px-4">
              <Pagination
                page={data?.page ?? page}
                pageSize={data?.pageSize ?? PAGE_SIZE}
                total={data?.total ?? 0}
                onPage={onPage}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
