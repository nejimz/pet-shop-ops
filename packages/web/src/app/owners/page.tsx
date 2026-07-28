"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, ErrorText } from "@/components/ui";

type Owner = {
  id: string;
  name: string;
  phone?: string | null;
  pets?: Array<{ id: string; name: string }>;
};

export default function OwnersPage() {
  const [owners, setOwners] = useState<Owner[]>([]);
  const [q, setQ] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  const load = useCallback(async (query = "") => {
    const path = query ? `/owners?q=${encodeURIComponent(query)}` : "/owners";
    const data = await api<Owner[]>(path);
    setOwners(data);
  }, []);

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "Failed"));
  }, [load]);

  async function onSearch(e?: FormEvent) {
    e?.preventDefault();
    setError(null);
    try {
      await load(q.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    }
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api("/owners", {
        method: "POST",
        body: JSON.stringify({ name, phone: phone || undefined }),
      });
      setName("");
      setPhone("");
      setShowCreate(false);
      await load(q.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Create failed");
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader
        title="Owners"
        description="Search by name, phone, or pet name."
        action={
          <button
            type="button"
            className="btn-primary"
            onClick={() => setShowCreate((v) => !v)}
          >
            {showCreate ? "Close" : "Add owner"}
          </button>
        }
      />

      <form onSubmit={onSearch} className="flex flex-wrap gap-2">
        <input
          className="input max-w-sm"
          placeholder="Search…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit" className="btn-ghost">
          Search
        </button>
      </form>

      {showCreate ? (
        <form onSubmit={onCreate} className="card grid gap-3 p-5 sm:grid-cols-3 animate-fade-in">
          <div>
            <label className="label">Name</label>
            <input className="input" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div>
            <label className="label">Phone</label>
            <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary">
              Save owner
            </button>
          </div>
        </form>
      ) : null}

      <ErrorText message={error} />

      <div className="card overflow-hidden">
        {owners.length === 0 ? (
          <EmptyState message="No owners found." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Phone</th>
                <th>Pets</th>
              </tr>
            </thead>
            <tbody>
              {owners.map((owner) => (
                <tr key={owner.id}>
                  <td>
                    <Link
                      href={`/owners/${owner.id}`}
                      className="font-medium text-brand-800 transition hover:text-brand-600"
                    >
                      {owner.name}
                    </Link>
                  </td>
                  <td className="text-neutral-600">{owner.phone || "—"}</td>
                  <td className="text-neutral-600">
                    {owner.pets?.map((p) => p.name).join(", ") || "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
