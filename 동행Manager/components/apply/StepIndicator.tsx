"use client";

import { cn } from "@/lib/utils";

const STEPS = 4;

export function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-2" role="list" aria-label="진행 단계">
      {Array.from({ length: STEPS }, (_, i) => {
        const step = i + 1;
        const done = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex flex-1 items-center gap-2" role="listitem">
            <div
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors",
                done || active ? "bg-navy" : "bg-slate-200"
              )}
              aria-current={active ? "step" : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}
