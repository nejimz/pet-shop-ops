export function EmptyState({ message }: { message: string }) {
  return (
    <div className="px-4 py-12 text-center">
      <p className="text-sm text-neutral-500">{message}</p>
    </div>
  );
}

export function ErrorText({ message }: { message?: string | null }) {
  if (!message) return null;
  return <p className="text-sm text-red-600">{message}</p>;
}

export function StatusPill({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "good" | "warn" | "bad";
}) {
  const tones = {
    neutral: "bg-brand-50 text-brand-700",
    good: "bg-emerald-50 text-emerald-800",
    warn: "bg-amber-50 text-amber-800",
    bad: "bg-red-50 text-red-700",
  };
  return <span className={`status-pill ${tones[tone]}`}>{children}</span>;
}
