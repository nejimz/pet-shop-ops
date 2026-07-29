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

  useEffect(() => {
    if (!owner) return;
    if (typeof window === "undefined") return;
    if (window.location.hash !== "#add-pet") return;
    const el = document.getElementById("add-pet");
    el?.scrollIntoView({ behavior: "smooth", block: "center" });
    const input = el?.querySelector<HTMLInputElement>('input[name="petName"]');
    input?.focus();
  }, [owner]);

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
  const activePets = owner.pets.filter((p) => !p.archivedAt);

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
        <p className="mt-2 text-sm text-brand-700">
          {activePets.length === 0
            ? "No pets on this account yet — add one below."
            : `${activePets.length} active ${activePets.length === 1 ? "pet" : "pets"} on this account.`}
        </p>
      </div>

      <ErrorText message={error} />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card p-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="font-display text-xl text-brand-900">Pets</h2>
              <p className="mt-1 text-sm text-neutral-500">
                Pets belong to this owner. Use the form below to register a new one.
              </p>
            </div>
            <a href="#add-pet" className="btn-ghost !py-1.5 !text-xs">
              Jump to add pet
            </a>
          </div>

          <ul className="mt-5 space-y-2">
            {owner.pets.length === 0 ? (
              <li className="rounded-xl border border-dashed border-brand-200 bg-brand-50/40 px-4 py-6 text-center text-sm text-neutral-600">
                No pets yet. Add the first pet for {owner.name} below.
              </li>
            ) : (
              owner.pets.map((pet) => (
                <li
                  key={pet.id}
                  className="flex items-center justify-between gap-2 rounded-xl px-3 py-2.5 transition hover:bg-brand-50/60"
                >
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

          <form
            id="add-pet"
            onSubmit={addPet}
            className="mt-5 scroll-mt-8 space-y-3 rounded-xl border border-brand-200 bg-brand-50/50 p-4"
          >
            <div>
              <h3 className="font-display text-lg text-brand-900">Add pet</h3>
              <p className="mt-0.5 text-sm text-neutral-600">
                New pet will be linked to <span className="font-medium text-brand-800">{owner.name}</span>.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              <div>
                <label className="label" htmlFor="petName">
                  Pet name
                </label>
                <input
                  id="petName"
                  name="petName"
                  className="input"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  placeholder="e.g. Luna"
                  required
                />
              </div>
              <div>
                <label className="label" htmlFor="species">
                  Species
                </label>
                <select
                  id="species"
                  className="input"
                  value={species}
                  onChange={(e) => setSpecies(e.target.value)}
                >
                  <option>Dog</option>
                  <option>Cat</option>
                  <option>Rabbit</option>
                  <option>Bird</option>
                  <option>Hamster</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="flex items-end">
                <button type="submit" className="btn-primary w-full sm:w-auto">
                  Add pet
                </button>
              </div>
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
