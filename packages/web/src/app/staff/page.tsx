"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/lib/auth";
import { PageHeader } from "@/components/PageHeader";
import { EmptyState, ErrorText, Pagination, StatusPill } from "@/components/ui";

const PAGE_SIZE = 100;

type StaffUser = {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STAFF";
};

export default function StaffPage() {
  const { user } = useAuth();
  const [users, setUsers] = useState<StaffUser[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"ADMIN" | "STAFF">("STAFF");
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [page, setPage] = useState(1);

  async function refresh() {
    setUsers(await api<StaffUser[]>("/users"));
    setPage(1);
  }

  useEffect(() => {
    if (user?.role !== "ADMIN") return;
    refresh().catch((err) => setError(err instanceof Error ? err.message : "Failed"));
  }, [user]);

  if (user && user.role !== "ADMIN") {
    return (
      <div className="card p-8 text-center">
        <p className="font-display text-2xl text-brand-900">Admin only</p>
        <p className="mt-2 text-sm text-neutral-600">
          Staff accounts are managed by administrators.
        </p>
      </div>
    );
  }

  async function onCreate(e: FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api("/users", {
        method: "POST",
        body: JSON.stringify({ name, email, password, role }),
      });
      setName("");
      setEmail("");
      setPassword("");
      setRole("STAFF");
      setShowCreate(false);
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed");
    }
  }

  const paged = useMemo(
    () => users.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE),
    [users, page],
  );

  return (
    <div className="space-y-7">
      <PageHeader
        title="Staff"
        description="Manage shop accounts and roles."
        action={
          <button type="button" className="btn-primary" onClick={() => setShowCreate((v) => !v)}>
            {showCreate ? "Close" : "Add user"}
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
            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Password</label>
            <input
              className="input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="label">Role</label>
            <select
              className="input"
              value={role}
              onChange={(e) => setRole(e.target.value as "ADMIN" | "STAFF")}
            >
              <option value="STAFF">STAFF</option>
              <option value="ADMIN">ADMIN</option>
            </select>
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
        {users.length === 0 ? (
          <EmptyState message="No staff users." />
        ) : (
          <>
            <table className="data-table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Role</th>
                </tr>
              </thead>
              <tbody>
                {paged.map((u) => (
                  <tr key={u.id}>
                    <td className="font-medium text-brand-900">{u.name}</td>
                    <td className="text-neutral-600">{u.email}</td>
                    <td>
                      <StatusPill tone={u.role === "ADMIN" ? "good" : "neutral"}>
                        {u.role}
                      </StatusPill>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="border-t border-brand-100 px-4">
              <Pagination page={page} pageSize={PAGE_SIZE} total={users.length} onPage={setPage} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
