"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { EmptyState, ErrorText, StatusPill } from "@/components/ui";

type Pet = {
  id: string;
  name: string;
  species?: string | null;
  breed?: string | null;
  sex?: string | null;
  weight?: number | null;
  allergies?: string | null;
  microchipId?: string | null;
  notes?: string | null;
  archivedAt?: string | null;
  owner?: { id: string; name: string } | null;
};

type TimelineItem = {
  id: string;
  type: "visit" | "sale";
  title: string;
  detail?: string;
  occurredAt: string;
};

export default function PetDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const [pet, setPet] = useState<Pet | null>(null);
  const [timeline, setTimeline] = useState<TimelineItem[]>([]);
  const [error, setError] = useState<string | null>(null);

  async function refresh() {
    const [p, t] = await Promise.all([
      api<Pet>(`/pets/${id}`),
      api<TimelineItem[]>(`/pets/${id}/timeline`),
    ]);
    setPet(p);
    setTimeline(t);
  }

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Failed"));
  }, [id]);

  async function archive() {
    if (!confirm("Archive this pet? History is kept.")) return;
    setError(null);
    try {
      await api(`/pets/${id}/archive`, { method: "POST" });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  if (!pet) return <EmptyState message={error || "Loading pet…"} />;

  const fields: Array<[string, string]> = [
    ["Species", pet.species || "—"],
    ["Breed", pet.breed || "—"],
    ["Sex", pet.sex || "—"],
    ["Weight", pet.weight != null ? `${pet.weight}` : "—"],
    ["Allergies", pet.allergies || "—"],
    ["Microchip", pet.microchipId || "—"],
    ["Notes", pet.notes || "—"],
  ];

  return (
    <div className="space-y-7">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <Link href="/pets" className="text-sm text-brand-600 transition hover:text-brand-800">
            ← Pets
          </Link>
          <h1 className="mt-3 font-display text-3xl tracking-tight text-brand-900">
            {pet.name}
          </h1>
          <p className="mt-1.5 text-sm text-neutral-600">
            Owner:{" "}
            {pet.owner ? (
              <Link href={`/owners/${pet.owner.id}`} className="text-brand-700 underline">
                {pet.owner.name}
              </Link>
            ) : (
              "—"
            )}
            {pet.archivedAt ? (
              <span className="ml-3">
                <StatusPill tone="warn">Archived</StatusPill>
              </span>
            ) : null}
          </p>
        </div>
        {!pet.archivedAt ? (
          <button type="button" className="btn-ghost" onClick={archive}>
            Archive pet
          </button>
        ) : null}
      </div>

      <ErrorText message={error} />

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="card p-5">
          <h2 className="font-display text-xl text-brand-900">Profile</h2>
          <dl className="mt-4 grid gap-3 sm:grid-cols-2">
            {fields.map(([label, value]) => (
              <div key={label} className={label === "Notes" || label === "Allergies" ? "sm:col-span-2" : ""}>
                <dt className="label mb-0">{label}</dt>
                <dd className="mt-1 text-sm text-brand-900">{value}</dd>
              </div>
            ))}
          </dl>
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
