"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useSettings } from "@/lib/settings";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, ErrorText, Pagination, StatusPill } from "@/components/ui";

const PAGE_SIZE = 100;

type Product = {
  id: string;
  name: string;
  sku: string;
  price: number | string;
  stockQty: number;
  active: boolean;
};

export default function ProductsPage() {
  const { formatMoney } = useSettings();
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [sku, setSku] = useState("");
  const [price, setPrice] = useState("");
  const [stockQty, setStockQty] = useState("0");
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);

  async function refresh() {
    setProducts(await api<Product[]>("/products"));
    setPage(1);
  }

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Failed"));
  }, []);

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api("/products", {
        method: "POST",
        body: JSON.stringify({
          name,
          sku,
          price: Number(price),
          stockQty: Number(stockQty),
        }),
      });
      setName("");
      setSku("");
      setPrice("");
      setStockQty("0");
      setShowCreate(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  const paged = useMemo(
    () => products.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [products, page],
  );

  return (
    <div className="space-y-7">
      <PageHeader
        title="Products"
        description="Catalog of supplies with stock and pricing."
        action={
          <button type="button" className="btn-primary" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? "Close" : "Add product"}
          </button>
        }
      />

      {showCreate ? (
        <form onSubmit={onCreate} className="card grid gap-3 p-5 animate-fade-in sm:grid-cols-2 lg:grid-cols-5">
          <div>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label">SKU</label>
            <input className="input" value={sku} onChange={(e) => setSku(e.target.value)} required />
          </div>
          <div>
            <label className="label">Price</label>
            <input
              className="input"
              type="number"
              min="0"
              step="0.01"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Stock</label>
            <input
              className="input"
              type="number"
              min="0"
              value={stockQty}
              onChange={(e) => setStockQty(e.target.value)}
              required
            />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary">
              Save
            </button>
          </div>
        </form>
      ) : null}

      <ErrorText message={error} />

      <div className="card overflow-hidden">
        {products.length === 0 ? (
          <EmptyState message="No products yet." />
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>SKU</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Active</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((p) => (
                  <tr key={p.id}>
                    <td>
                      <Link
                        href={`/products/${p.id}`}
                        className="font-medium text-brand-800 transition hover:text-brand-600"
                      >
                        {p.name}
                      </Link>
                    </td>
                    <td className="font-mono text-xs text-neutral-500">{p.sku}</td>
                    <td className="tabular-nums text-neutral-700">
                      {formatMoney(p.price)}
                    </td>
                    <td className="tabular-nums text-neutral-700">{p.stockQty}</td>
                    <td>
                      <StatusPill tone={p.active ? "good" : "neutral"}>
                        {p.active ? "Yes" : "No"}
                      </StatusPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-brand-100 px-4">
              <Pagination page={page} pageSize={PAGE_SIZE} total={products.length} onPage={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
