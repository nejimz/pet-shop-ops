"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, ErrorText, Pagination, StatusPill } from "@/components/ui";

const PAGE_SIZE = 100;
const FETCH_LIMIT = 1000;

type Owner = {
  id: string;
  name: string;
  pets?: Array<{ id: string; name: string; archivedAt?: string | null }>;
};
type Product = { id: string; name: string; price: number | string; stockQty: number };
type Sale = {
  id: string;
  total: number | string;
  status: string;
  paymentMethod: string;
  occurredAt: string;
  owner?: { name: string } | null;
  walkInName?: string | null;
  lines?: Array<{ product?: { name: string }; quantity: number }>;
};

type LineDraft = { productId: string; quantity: number };

export default function SalesPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [sales, setSales] = useState<Sale[]>([]);
  const [ownerId, setOwnerId] = useState("");
  const [walkInName, setWalkInName] = useState("");
  const [petId, setPetId] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("CASH");
  const [productId, setProductId] = useState("");
  const [qty, setQty] = useState("1");
  const [lines, setLines] = useState<LineDraft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const pets = useMemo(
    () => owners.find((o) => o.id === ownerId)?.pets?.filter((p) => !p.archivedAt) ?? [],
    [owners, ownerId],
  );

  const total = useMemo(() => {
    return lines.reduce((sum, line) => {
      const p = products.find((x) => x.id === line.productId);
      return sum + (p ? Number(p.price) * line.quantity : 0);
    }, 0);
  }, [lines, products]);

  async function refresh() {
    const [o, p, s] = await Promise.all([
      api<Owner[]>("/owners"),
      api<Product[]>("/products?activeOnly=true"),
      api<Sale[]>(`/sales?limit=${FETCH_LIMIT}`),
    ]);
    setOwners(o);
    setProducts(p);
    setSales(s);
    setPage(1);
  }

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Failed"));
  }, []);

  function addLine() {
    if (!productId) return;
    const quantity = Math.max(1, Number(qty) || 1);
    setLines((prev) => {
      const existing = prev.find((l) => l.productId === productId);
      if (existing) {
        return prev.map((l) =>
          l.productId === productId ? { ...l, quantity: l.quantity + quantity } : l,
        );
      }
      return [...prev, { productId, quantity }];
    });
    setQty("1");
  }

  async function completeSale(e: FormEvent) {
    e.preventDefault();
    setError(null);
    if (!ownerId && !walkInName.trim()) {
      setError("Choose an owner or enter a walk-in name.");
      return;
    }
    if (lines.length === 0) {
      setError("Add at least one product line.");
      return;
    }
    try {
      await api("/sales", {
        method: "POST",
        body: JSON.stringify({
          ownerId: ownerId || undefined,
          walkInName: walkInName.trim() || undefined,
          petId: petId || undefined,
          paymentMethod,
          lines,
        }),
      });
      setLines([]);
      setWalkInName("");
      setPetId("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  async function voidSale(id: string) {
    if (!confirm("Void this sale and restore stock?")) return;
    setError(null);
    try {
      await api(`/sales/${id}/void`, { method: "POST" });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  const paged = useMemo(
    () => sales.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [sales, page],
  );

  return (
    <div className="space-y-7">
      <PageHeader
        title="Sales"
        description="Ring up supplies and review recent purchase history."
      />

      <form onSubmit={completeSale} className="card space-y-5 p-5">
        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="label">Owner</label>
            <select
              className="input"
              value={ownerId}
              onChange={(e) => {
                setOwnerId(e.target.value);
                setPetId("");
              }}
            >
              <option value="">Walk-in / none</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Walk-in name</label>
            <input
              className="input"
              value={walkInName}
              onChange={(e) => setWalkInName(e.target.value)}
              disabled={!!ownerId}
            />
          </div>
          <div>
            <label className="label">Pet (optional)</label>
            <select
              className="input"
              value={petId}
              onChange={(e) => setPetId(e.target.value)}
              disabled={!ownerId}
            >
              <option value="">—</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Payment</label>
            <select
              className="input"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="CASH">CASH</option>
              <option value="CARD">CARD</option>
              <option value="OTHER">OTHER</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-end gap-2 border-t border-brand-100 pt-5">
          <div className="min-w-[12rem] flex-1">
            <label className="label">Product</label>
            <select className="input" value={productId} onChange={(e) => setProductId(e.target.value)}>
              <option value="">Select…</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} (${Number(p.price).toFixed(2)}) · {p.stockQty} left
                </option>
              ))}
            </select>
          </div>
          <div className="w-24">
            <label className="label">Qty</label>
            <input className="input" type="number" min="1" value={qty} onChange={(e) => setQty(e.target.value)} />
          </div>
          <button type="button" className="btn-ghost" onClick={addLine}>
            Add line
          </button>
        </div>

        {lines.length > 0 ? (
          <ul className="divide-y divide-neutral-100 rounded-xl border border-brand-100/80">
            {lines.map((line) => {
              const p = products.find((x) => x.id === line.productId);
              return (
                <li key={line.productId} className="flex items-center justify-between px-4 py-3 text-sm">
                  <span>
                    {p?.name} × {line.quantity}
                  </span>
                  <span className="tabular-nums text-brand-800">
                    ${((p ? Number(p.price) : 0) * line.quantity).toFixed(2)}
                  </span>
                </li>
              );
            })}
          </ul>
        ) : null}

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="font-display text-2xl text-brand-900">
            Total ${total.toFixed(2)}
          </p>
          <button type="submit" className="btn-primary">
            Complete sale
          </button>
        </div>
      </form>

      <ErrorText message={error} />

      <section className="card overflow-hidden">
        <div className="border-b border-brand-100 px-5 py-4">
          <h2 className="font-display text-xl text-brand-900">History</h2>
        </div>
        {sales.length === 0 ? (
          <EmptyState message="No sales yet." />
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>When</th>
                  <th>Buyer</th>
                  <th>Items</th>
                  <th>Total</th>
                  <th>Status</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {paged.map((sale) => (
                  <tr key={sale.id}>
                    <td className="whitespace-nowrap text-neutral-600">
                      {new Date(sale.occurredAt).toLocaleString()}
                    </td>
                    <td className="font-medium text-brand-900">
                      {sale.owner?.name || sale.walkInName || "—"}
                    </td>
                    <td className="text-neutral-600">
                      {sale.lines?.map((l) => `${l.product?.name}×${l.quantity}`).join(", ") || "—"}
                    </td>
                    <td className="tabular-nums">${Number(sale.total).toFixed(2)}</td>
                    <td>
                      <StatusPill tone={sale.status === "VOIDED" ? "bad" : "good"}>
                        {sale.status}
                      </StatusPill>
                    </td>
                    <td className="text-right">
                      {sale.status === "COMPLETED" ? (
                        <button type="button" className="btn-quiet" onClick={() => voidSale(sale.id)}>
                          Void
                        </button>
                      ) : null}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-brand-100 px-4">
              <Pagination page={page} pageSize={PAGE_SIZE} total={sales.length} onPage={setPage} />
            </div>
          </>
        )}
      </section>
    </div>
  );
}
