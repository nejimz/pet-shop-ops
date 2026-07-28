"use client";

import Link from "next/link";
import { FormEvent, useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, ErrorText } from "@/components/ui";

type Pet = {
  id: string;
  name: string;
  species?: string | null;
  owner?: { id: string; name: string } | null;
  ownerId?: string;
};

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [q, setQ] = useState("");
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async (query = "") => {
    const path = query ? `/pets?q=${encodeURIComponent(query)}` : "/pets";
    setPets(await api<Pet[]>(path));
  }, []);

  useEffect(() => {
    load().catch((err) => setError(err instanceof Error ? err.message : "Failed"));
  }, [load]);

  async function onSearch(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await load(q.trim());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Search failed");
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader
        title="Pets"
        description="Find pets by name or owner. Add new pets from an owner profile."
      />

      <form onSubmit={onSearch} className="flex flex-wrap gap-2">
        <input
          className="input max-w-sm"
          placeholder="Search pet or owner…"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button type="submit" className="btn-ghost">
          Search
        </button>
      </form>

      <ErrorText message={error} />

      <div className="card overflow-hidden">
        {pets.length === 0 ? (
          <EmptyState message="No pets found." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>Pet</th>
                <th>Species</th>
                <th>Owner</th>
              </tr>
            </thead>
            <tbody>
              {pets.map((pet) => (
                <tr key={pet.id}>
                  <td>
                    <Link
                      href={`/pets/${pet.id}`}
                      className="font-medium text-brand-800 transition hover:text-brand-600"
                    >
                      {pet.name}
                    </Link>
                  </td>
                  <td className="text-neutral-600">{pet.species || "—"}</td>
                  <td>
                    {pet.owner ? (
                      <Link
                        href={`/owners/${pet.owner.id}`}
                        className="text-brand-700 underline decoration-brand-100 underline-offset-2"
                      >
                        {pet.owner.name}
                      </Link>
                    ) : (
                      "—"
                    )}
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
