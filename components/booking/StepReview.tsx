"use client";

import { FieldError } from "@/components/ui/chip";
import { getPlanById } from "@/lib/plans";
import type { BookingFormData } from "@/lib/types";
import { cn, formatPrice } from "@/lib/utils";

interface StepReviewProps {
  data: BookingFormData;
  errors: Partial<Record<keyof BookingFormData, string>>;
  onChange: <K extends keyof BookingFormData>(
    key: K,
    value: BookingFormData[K]
  ) => void;
}

function Row({ label, value }: { label: string; value?: string }) {
  if (!value) return null;
  return (
    <div className="flex items-start justify-between gap-4 py-2.5">
      <dt className="shrink-0 text-sm text-slate-500">{label}</dt>
      <dd className="text-right text-sm font-semibold text-navy">{value}</dd>
    </div>
  );
}

export function StepReview({ data, errors, onChange }: StepReviewProps) {
  const plan = getPlanById(data.selectedPlan);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg font-bold text-navy">접수 내용 확인</h2>
        <p className="mt-1 text-sm text-slate-500">
          제출 전 정보를 한 번 더 확인해 주세요.
        </p>
      </div>

      <section className="rounded-3xl bg-slate-50 p-5">
        <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
          신청자 · 환자
        </h3>
        <dl className="divide-y divide-slate-200/80">
          <Row label="신청자" value={data.applicantName} />
          <Row label="연락처" value={data.applicantPhone} />
          <Row label="관계" value={data.relationship} />
          <Row label="환자" value={data.patientName} />
          <Row
            label="환자 정보"
            value={[data.patientGender, data.patientAge]
              .filter(Boolean)
              .join(" · ")}
          />
          <Row label="환자 연락처" value={data.patientPhone} />
        </dl>
      </section>

      <section className="rounded-3xl bg-slate-50 p-5">
        <h3 className="mb-1 text-xs font-bold uppercase tracking-wider text-slate-400">
          병원 · 진료
        </h3>
        <dl className="divide-y divide-slate-200/80">
          <Row label="병원" value={data.hospitalName} />
          <Row label="진료과" value={data.department} />
          <Row
            label="일정"
            value={[data.appointmentDate, data.appointmentTime]
              .filter(Boolean)
              .join(" ")}
          />
          <Row label="질환/상태" value={data.medicalCondition} />
          <Row label="요청사항" value={data.specialRequests} />
        </dl>
      </section>

      {plan && (
        <section className="rounded-3xl border-2 border-navy/10 bg-navy p-5 text-white">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-medium text-white/60">선택 요금제</p>
              <p className="mt-0.5 text-lg font-bold">{plan.name}</p>
              <p className="text-sm text-white/70">{plan.hours}시간 동행</p>
            </div>
            <p className="text-xl font-extrabold text-gold">
              {formatPrice(plan.price)}
            </p>
          </div>
        </section>
      )}

      <section className="space-y-3">
        <h3 className="text-sm font-bold text-navy">약관 동의</h3>

        <label
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors",
            data.agreePrivacy
              ? "border-navy bg-navy/[0.03]"
              : "border-slate-200"
          )}
        >
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 accent-navy"
            checked={data.agreePrivacy}
            onChange={(e) => onChange("agreePrivacy", e.target.checked)}
          />
          <span className="text-sm leading-relaxed text-slate-700">
            <strong className="text-navy">[필수]</strong> 개인정보 수집 및
            이용에 동의합니다. 신청·환자 연락처는 예약 확인 및 서비스 제공
            목적으로만 사용됩니다.
          </span>
        </label>
        <FieldError message={errors.agreePrivacy} />

        <label
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors",
            data.agreeLiability
              ? "border-navy bg-navy/[0.03]"
              : "border-slate-200"
          )}
        >
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 accent-navy"
            checked={data.agreeLiability}
            onChange={(e) => onChange("agreeLiability", e.target.checked)}
          />
          <span className="text-sm leading-relaxed text-slate-700">
            <strong className="text-navy">[필수]</strong> 배상책임 및 서비스
            한계 안내에 동의합니다. MediBlack은 의료행위를 제공하지 않으며,
            병원 동행·안내·의사소통 지원에 한정됩니다.
          </span>
        </label>
        <FieldError message={errors.agreeLiability} />
      </section>
    </div>
  );
}
