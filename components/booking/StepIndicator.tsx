"use client";

import { cn } from "@/lib/utils";

const STEPS = [
  { id: 1, label: "신청자" },
  { id: 2, label: "병원" },
  { id: 3, label: "요금제" },
  { id: 4, label: "확인" },
];

interface StepIndicatorProps {
  current: number;
}

export function StepIndicator({ current }: StepIndicatorProps) {
  return (
    <nav aria-label="접수 단계" className="w-full">
      <ol className="flex items-center gap-1">
        {STEPS.map((step, index) => {
          const done = current > step.id;
          const active = current === step.id;
          return (
            <li key={step.id} className="flex flex-1 items-center gap-1">
              <div className="flex w-full flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "flex h-8 w-full items-center justify-center rounded-full text-xs font-bold transition-colors",
                    done && "bg-navy text-white",
                    active && "bg-royal text-white",
                    !done && !active && "bg-slate-100 text-slate-400"
                  )}
                  aria-current={active ? "step" : undefined}
                >
                  {done ? "✓" : step.id}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium",
                    active || done ? "text-navy" : "text-slate-400"
                  )}
                >
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <span className="sr-only">다음</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
