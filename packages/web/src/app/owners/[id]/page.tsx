"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { EmptyState, ErrorText, StatusPill } from "@/components/ui";

type Owner = {
  id: string;
  name: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  notes?: string | null;
  pets: Array<{ id: string; name: string; species?: string | null; archivedAt?: string | null }>;
};

type TimelineItem = {
  id: string;
  type: "visit" | "sale";
  title: string;
  detail?: string;
  occurredAt: string;
};

export default function OwnerDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [owner, setOwner] = useState<Owner | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [petName, setPetName] = useState("");
  const [species, setSpecies] = useState("Dog");
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const [o, t] = await Promise.all([
      api<Owner>(`/owners/${id}`),
      api<TimelineItem[]>(`/owners/${id}/timeline`),
    ]);
    setOwner(o);
    setTimeline(t);
  }

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Failed"));
  }, [id]);

  async function addPet(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api("/pets", {
        method: "POST",
        body: JSON.stringify({ ownerId: id, name: petName, species }),
      });
      setPetName("");
      setSpecies("Dog");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  if (!owner) {
    return <EmptyState message={error || "Loading owner…"} />;
  }

  const contact = [owner.phone, owner.email, owner.address].filter(Boolean).join(" · ");

  return (
    <div className="space-y-7">
      <div>
        <Link href="/owners" className="text-sm text-brand-600 transition hover:text-brand-800">
          ← Owners
        </Link>
        <h1 className="mt-3 font-display text-3xl tracking-tight text-brand-900">
          {owner.name}
        </h1>
        <p className="mt-1.5 text-sm text-neutral-600">
          {contact || "No contact details"}
        </p>
      </div>

      <ErrorText message={error} />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="font-display text-xl text-brand-900">Pets</h2>
          <ul className="mt-4 space-y-2">
            {owner.pets.length === 0 ? (
              <li className="text-sm text-neutral-500">No pets yet.</li>
            ) : (
              owner.pets.map((pet) => (
                <li key={pet.id} className="flex items-center justify-between gap-2 rounded-xl px-2 py-2 hover:bg-brand-50/60">
                  <Link href={`/pets/${pet.id}`} className="font-medium text-brand-800">
                    {pet.name}
                    <span className="ml-2 text-sm font-normal text-neutral-500">
                      {pet.species || ""}
                    </span>
                  </Link>
                  {pet.archivedAt ? <StatusPill tone="warn">Archived</StatusPill> : null}
                </li>
              ))
            )}
          </ul>

          <form onSubmit={addPet} className="mt-5 grid gap-3 border-t border-brand-100 pt-5 sm:grid-cols-3">
            <div>
              <label className="label">Pet name</label>
              <input className="input" value={petName} onChange={(e) => setPetName(e.target.value)} required />
            </div>
            <div>
              <label className="label">Species</label>
              <input className="input" value={species} onChange={(e) => setSpecies(e.target.value)} />
            </div>
            <div className="flex items-end">
              <button type="submit" className="btn-primary">
                Add pet
              </button>
            </div>
          </form>
        </section>

        <section className="card p-5">
          <h2 className="font-display text-xl text-brand-900">Timeline</h2>
          {timeline.length === 0 ? (
            <p className="mt-4 text-sm text-neutral-500">No visits or sales yet.</p>
          ) : (
            <ul className="mt-5 space-y-4 border-l-2 border-brand-200 pl-4">
              {timeline.map((item) => (
                <li key={`${item.type}-${item.id}`} className="relative">
                  <span className="absolute -left-[1.4rem] top-1.5 h-2.5 w-2.5 rounded-full bg-brand-400 ring-4 ring-white" />
                  <p className="text-xs uppercase tracking-[0.08em] text-neutral-500">
                    {item.type} · {new Date(item.occurredAt).toLocaleString()}
                  </p>
                  <p className="mt-1 font-medium text-brand-900">{item.title}</p>
                  {item.detail ? (
                    <p className="mt-0.5 text-sm text-neutral-600">{item.detail}</p>
                  ) : null}
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
