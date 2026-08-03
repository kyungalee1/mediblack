import { cn } from "@/lib/utils";

const TONE: Record<string, string> = {
  PENDING: "bg-amber-100 text-amber-900",
  CONFIRMED: "bg-sky-100 text-sky-900",
  ASSIGNED: "bg-indigo-100 text-indigo-900",
  IN_PROGRESS: "bg-violet-100 text-violet-900",
  COMPLETED: "bg-emerald-100 text-emerald-900",
  CANCELLED: "bg-slate-200 text-slate-700",
  REVIEWING: "bg-sky-100 text-sky-900",
  APPROVED: "bg-emerald-100 text-emerald-900",
  REJECTED: "bg-red-100 text-red-800",
  INACTIVE: "bg-slate-200 text-slate-700",
};

export function StatusBadge({
  status,
  label,
}: {
  status: string;
  label?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex rounded-full px-2.5 py-1 text-xs font-bold",
        TONE[status] || "bg-slate-100 text-slate-700"
      )}
    >
      {label || status}
    </span>
  );
}
