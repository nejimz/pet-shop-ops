"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, ErrorText, Pagination } from "@/components/ui";

const PAGE_SIZE = 100;

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
  const [page, setPage] = useState(1);

  const load = useCallback(async (query = "") => {
    const path = query ? `/owners?q=${encodeURIComponent(query)}` : "/owners";
    const data = await api<Owner[]>(path);
    setOwners(data);
    setPage(1);
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

  const paged = useMemo(
    () => owners.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [owners, page],
  );

  return (
    <div className="space-y-7">
      <PageHeader
        title="Owners"
        description="Find an owner, then add pets from their profile."
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
          placeholder="Search by owner, phone, or pet…"
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
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Owner</th>
                  <th>Phone</th>
                  <th>Pets</th>
                  <th className="text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((owner) => {
                  const pets = owner.pets ?? [];
                  const shown = pets.slice(0, 3);
                  const extra = pets.length - shown.length;

                  return (
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
                      <td>
                        {pets.length === 0 ? (
                          <span className="text-sm text-neutral-400">No pets yet</span>
                        ) : (
                          <div className="flex flex-wrap items-center gap-1.5">
                            <span className="status-pill bg-brand-50 text-brand-700">
                              {pets.length} {pets.length === 1 ? "pet" : "pets"}
                            </span>
                            {shown.map((pet) => (
                              <Link
                                key={pet.id}
                                href={`/pets/${pet.id}`}
                                className="rounded-md bg-neutral-50 px-2 py-0.5 text-xs text-neutral-700 transition hover:bg-brand-50 hover:text-brand-800"
                              >
                                {pet.name}
                              </Link>
                            ))}
                            {extra > 0 ? (
                              <Link
                                href={`/owners/${owner.id}`}
                                className="text-xs text-neutral-500 hover:text-brand-700"
                              >
                                +{extra} more
                              </Link>
                            ) : null}
                          </div>
                        )}
                      </td>
                      <td className="text-right">
                        <div className="flex flex-wrap justify-end gap-1">
                          <Link
                            href={`/owners/${owner.id}#add-pet`}
                            className="btn-primary !px-3 !py-1.5 !text-xs"
                          >
                            Add pet
                          </Link>
                          <Link
                            href={`/owners/${owner.id}`}
                            className="btn-quiet"
                          >
                            Open
                          </Link>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="border-t border-brand-100 px-4">
              <Pagination page={page} pageSize={PAGE_SIZE} total={owners.length} onPage={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
