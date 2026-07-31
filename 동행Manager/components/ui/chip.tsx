"use client";

import { cn } from "@/lib/utils";

interface FieldErrorProps {
  message?: string;
  className?: string;
}

export function FieldError({ message, className }: FieldErrorProps) {
  if (!message) return null;
  return (
    <p className={cn("mt-1.5 text-sm text-red-600", className)} role="alert">
      {message}
    </p>
  );
}

interface ChipProps {
  selected?: boolean;
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export function Chip({ selected, children, onClick, className }: ChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={cn(
        "inline-flex h-12 items-center justify-center rounded-2xl border-2 px-4 text-sm font-semibold transition-all",
        selected
          ? "border-navy bg-navy text-white"
          : "border-slate-200 bg-white text-slate-700 hover:border-navy/30",
        className
      )}
    >
      {children}
    </button>
  );
}
