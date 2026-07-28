"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, ErrorText, StatusPill } from "@/components/ui";

type Owner = { id: string; name: string; pets?: Array<{ id: string; name: string; archivedAt?: string | null }> };
type Appointment = {
  id: string;
  startsAt: string;
  type: string;
  reason?: string | null;
  status: string;
  owner?: { name: string };
  pet?: { name: string };
};

const TYPES = ["CHECKUP", "VACCINE", "GROOMING", "OTHER"] as const;

function statusTone(status: string) {
  if (status === "COMPLETED") return "good" as const;
  if (status === "CANCELLED" || status === "NO_SHOW") return "bad" as const;
  return "neutral" as const;
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [owners, setOwners] = useState<Owner[]>([]);
  const [ownerId, setOwnerId] = useState("");
  const [petId, setPetId] = useState("");
  const [startsAt, setStartsAt] = useState("");
  const [type, setType] = useState<(typeof TYPES)[number]>("CHECKUP");
  const [reason, setReason] = useState("");
  const [completeId, setCompleteId] = useState<string | null>(null);
  const [notes, setNotes] = useState("");
  const [treatments, setTreatments] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [showBook, setShowBook] = useState(false);

  const pets = useMemo(
    () => owners.find((o) => o.id === ownerId)?.pets?.filter((p) => !p.archivedAt) ?? [],
    [owners, ownerId],
  );

  async function refresh() {
    const from = new Date();
    from.setHours(0, 0, 0, 0);
    const to = new Date(from);
    to.setDate(to.getDate() + 14);
    const [a, o] = await Promise.all([
      api<Appointment[]>(
        `/appointments?from=${encodeURIComponent(from.toISOString())}&to=${encodeURIComponent(to.toISOString())}`,
      ),
      api<Owner[]>("/owners"),
    ]);
    setAppointments(a);
    setOwners(o);
  }

  useEffect(() => {
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Failed"));
  }, []);

  async function book(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api("/appointments", {
        method: "POST",
        body: JSON.stringify({
          ownerId,
          petId,
          startsAt: new Date(startsAt).toISOString(),
          type,
          reason: reason || undefined,
        }),
      });
      setPetId("");
      setReason("");
      setShowBook(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  async function patchStatus(id: string, status: string) {
    setError(null);
    try {
      await api(`/appointments/${id}`, {
        method: "PATCH",
        body: JSON.stringify({ status }),
      });
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  async function complete(e: FormEvent) {
    e.preventDefault();
    if (!completeId) return;
    setError(null);
    try {
      await api(`/appointments/${completeId}/complete`, {
        method: "POST",
        body: JSON.stringify({
          notes,
          treatmentsSummary: treatments || undefined,
        }),
      });
      setCompleteId(null);
      setNotes("");
      setTreatments("");
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  return (
    <div className="space-y-7">
      <PageHeader
        title="Appointments"
        description="Next two weeks of consultations — book, update, or complete visits."
        action={
          <button type="button" className="btn-primary" onClick={() => setShowBook((v) => !v)}>
            {showBook ? "Close" : "Book appointment"}
          </button>
        }
      />

      {showBook ? (
        <form onSubmit={book} className="card grid gap-3 p-5 animate-fade-in md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="label">Owner</label>
            <select
              className="input"
              value={ownerId}
              onChange={(e) => {
                setOwnerId(e.target.value);
                setPetId("");
              }}
              required
            >
              <option value="">Select…</option>
              {owners.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">Pet</label>
            <select className="input" value={petId} onChange={(e) => setPetId(e.target.value)} required>
              <option value="">Select…</option>
              {pets.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="label">When</label>
            <input
              className="input"
              type="datetime-local"
              value={startsAt}
              onChange={(e) => setStartsAt(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Type</label>
            <select className="input" value={type} onChange={(e) => setType(e.target.value as typeof type)}>
              {TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="label">Reason</label>
            <input className="input" value={reason} onChange={(e) => setReason(e.target.value)} />
          </div>
          <div className="flex items-end">
            <button type="submit" className="btn-primary">
              Book
            </button>
          </div>
        </form>
      ) : null}

      {completeId ? (
        <form onSubmit={complete} className="card space-y-3 p-5 animate-fade-in">
          <h2 className="font-display text-xl text-brand-900">Complete appointment — visit notes</h2>
          <div>
            <label className="label">Notes</label>
            <textarea
              className="input min-h-[100px]"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Treatments summary</label>
            <input className="input" value={treatments} onChange={(e) => setTreatments(e.target.value)} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="btn-primary">
              Save visit
            </button>
            <button type="button" className="btn-ghost" onClick={() => setCompleteId(null)}>
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      <ErrorText message={error} />

      <div className="card overflow-hidden">
        {appointments.length === 0 ? (
          <EmptyState message="No appointments in this window." />
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>When</th>
                <th>Owner / Pet</th>
                <th>Type</th>
                <th>Status</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {appointments.map((a) => (
                <tr key={a.id}>
                  <td className="whitespace-nowrap text-neutral-700">
                    {new Date(a.startsAt).toLocaleString()}
                  </td>
                  <td>
                    <p className="font-medium text-brand-900">{a.owner?.name}</p>
                    <p className="text-sm text-neutral-500">{a.pet?.name}</p>
                  </td>
                  <td className="text-neutral-600">{a.type}</td>
                  <td>
                    <StatusPill tone={statusTone(a.status)}>{a.status}</StatusPill>
                  </td>
                  <td className="text-right">
                    {a.status === "SCHEDULED" ? (
                      <div className="flex flex-wrap justify-end gap-1">
                        <button type="button" className="btn-quiet" onClick={() => setCompleteId(a.id)}>
                          Complete
                        </button>
                        <button
                          type="button"
                          className="btn-quiet"
                          onClick={() => patchStatus(a.id, "CANCELLED")}
                        >
                          Cancel
                        </button>
                        <button
                          type="button"
                          className="btn-quiet"
                          onClick={() => patchStatus(a.id, "NO_SHOW")}
                        >
                          No-show
                        </button>
                      </div>
                    ) : null}
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
