"use client";

import { Check } from "lucide-react";
import { motion } from "framer-motion";
import { FieldError } from "@/components/ui/chip";
import { PLANS } from "@/lib/plans";
import type { BookingFormData, PlanId } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

interface StepPlanProps {
  data: BookingFormData;
  errors: Partial<Record<keyof BookingFormData, string>>;
  onChange: <K extends keyof BookingFormData>(
    key: K,
    value: BookingFormData[K]
  ) => void;
}

export function StepPlan({ data, errors, onChange }: StepPlanProps) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-navy">VIP 요금제 선택</h2>
        <p className="mt-1 text-sm text-slate-500">
          진료 일정에 맞는 동행 시간을 선택해 주세요.
        </p>
      </div>

      <div className="space-y-3" role="radiogroup" aria-label="요금제">
        {PLANS.map((plan) => {
          const selected = data.selectedPlan === plan.id;
          return (
            <motion.button
              key={plan.id}
              type="button"
              role="radio"
              aria-checked={selected}
              whileTap={{ scale: 0.985 }}
              onClick={() => onChange("selectedPlan", plan.id as PlanId)}
              className={cn(
                "relative w-full rounded-3xl border-2 p-5 text-left transition-colors",
                selected
                  ? "border-navy bg-navy/[0.03] shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-base font-bold text-navy">
                      {plan.name}
                    </span>
                    {plan.badge && (
                      <span
                        className={cn(
                          "rounded-full px-2.5 py-0.5 text-[11px] font-bold",
                          plan.badge === "인기"
                            ? "bg-royal text-white"
                            : "bg-gold text-navy"
                        )}
                      >
                        {plan.badge}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-sm text-slate-500">
                    {plan.subtitle} · {plan.hours}시간
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-extrabold tracking-tight text-navy">
                    {formatPrice(plan.price)}
                  </p>
                  <div
                    className={cn(
                      "ml-auto mt-2 flex h-6 w-6 items-center justify-center rounded-full border-2",
                      selected
                        ? "border-navy bg-navy text-white"
                        : "border-slate-300"
                    )}
                  >
                    {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                  </div>
                </div>
              </div>

              <ul className="mt-4 space-y-2">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm text-slate-600"
                  >
                    <Check
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0",
                        selected ? "text-royal" : "text-slate-400"
                      )}
                      strokeWidth={2.5}
                    />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </motion.button>
          );
        })}
      </div>
      <FieldError message={errors.selectedPlan} />
    </div>
  );
}
