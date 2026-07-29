"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useSettings } from "@/lib/settings";
import { EmptyState, ErrorText, StatusPill } from "@/components/ui";

type ProductDetail = {
  id: string;
  name: string;
  sku: string;
  price: number | string;
  stockQty: number;
  active: boolean;
  buyers?: Array<{ ownerName: string; quantity: number; occurredAt: string }>;
};

export default function ProductDetailPage() {
  const params = useParams<{ id: string }>();
  const { formatMoney } = useSettings();
  const [product, setProduct] = useState<ProductDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    api<ProductDetail>(`/products/${params.id}`)
      .then(setProduct)
      .catch((err) => setError(err instanceof Error ? err.message : "Failed"));
  }, [params.id]);

  if (!product) return <EmptyState message={error || "Loading product…"} />;

  return (
    <div className="space-y-7">
      <div>
        <Link href="/products" className="text-sm text-brand-600 transition hover:text-brand-800">
          ← Products
        </Link>
        <h1 className="mt-3 font-display text-3xl tracking-tight text-brand-900">
          {product.name}
        </h1>
        <p className="mt-1.5 font-mono text-sm text-neutral-500">{product.sku}</p>
      </div>

      <ErrorText message={error} />

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="card p-5">
          <p className="label mb-0">Price</p>
          <p className="mt-2 font-display text-3xl text-brand-800">
            {formatMoney(product.price)}
          </p>
        </div>
        <div className="card p-5">
          <p className="label mb-0">Stock</p>
          <p className="mt-2 font-display text-3xl text-brand-800">{product.stockQty}</p>
        </div>
        <div className="card p-5">
          <p className="label mb-0">Status</p>
          <div className="mt-3">
            <StatusPill tone={product.active ? "good" : "neutral"}>
              {product.active ? "Active" : "Inactive"}
            </StatusPill>
          </div>
        </div>
      </div>

      <section className="card overflow-hidden">
        <div className="border-b border-brand-100 px-5 py-4">
          <h2 className="font-display text-xl text-brand-900">Recent buyers</h2>
        </div>
        {!product.buyers?.length ? (
          <EmptyState message="No purchase history yet." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Buyer</th>
                <th>Qty</th>
                <th>When</th>
              </tr>
            </thead>
            <tbody>
              {product.buyers.map((b, i) => (
                <tr key={`${b.ownerName}-${i}`}>
                  <td className="font-medium text-brand-900">{b.ownerName}</td>
                  <td className="tabular-nums">{b.quantity}</td>
                  <td className="text-neutral-600">
                    {new Date(b.occurredAt).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  );
}
