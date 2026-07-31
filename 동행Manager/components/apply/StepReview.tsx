"use client";

import { Label } from "@/components/ui/label";
import { FieldError } from "@/components/ui/chip";
import type { ManagerFormData } from "@/lib/types";
import { cn } from "@/lib/utils";

type Errors = Partial<Record<keyof ManagerFormData, string>>;

interface Props {
  data: ManagerFormData;
  errors: Errors;
  onChange: <K extends keyof ManagerFormData>(
    key: K,
    value: ManagerFormData[K]
  ) => void;
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-3 border-b border-slate-100 py-3 last:border-0">
      <dt className="w-24 shrink-0 text-xs font-semibold text-slate-400">
        {label}
      </dt>
      <dd className="text-sm font-medium text-navy">{value || "—"}</dd>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl bg-slate-50 px-4 py-1 ring-1 ring-slate-100">
      <p className="pt-3 text-xs font-bold uppercase tracking-wider text-teal">
        {title}
      </p>
      <dl>{children}</dl>
    </div>
  );
}

export function StepReview({ data, errors, onChange }: Props) {
  const certs = [
    ...data.certifications.filter((c) => c !== "기타"),
    ...(data.otherCertification.trim()
      ? [`기타(${data.otherCertification.trim()})`]
      : data.certifications.includes("기타")
        ? ["기타"]
        : []),
  ].join(", ");

  return (
    <div className="space-y-4">
      <Section title="인적사항">
        <Row label="성함" value={data.fullName} />
        <Row label="연락처" value={data.phone} />
        <Row label="이메일" value={data.email} />
        <Row label="출생연도" value={data.birthYear} />
        <Row label="성별" value={data.gender} />
        <Row label="활동 지역" value={data.region} />
      </Section>

      <Section title="자격 · 경력">
        <Row label="자격증" value={certs} />
        <Row label="경력" value={data.experienceYears} />
        <Row label="전문 영역" value={data.specialtyAreas.join(", ")} />
      </Section>

      <Section title="활동 조건">
        <Row label="가능 요일" value={data.availableDays.join(", ")} />
        <Row label="언어" value={data.languages.join(", ")} />
        <Row label="선호 병원" value={data.preferredHospitals} />
        <Row label="자기소개" value={data.intro} />
        <Row label="지원 동기" value={data.motivation} />
      </Section>

      <div className="space-y-3 pt-2">
        <label
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors",
            data.agreePrivacy
              ? "border-navy bg-navy/[0.03]"
              : "border-slate-200 bg-white"
          )}
        >
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 accent-navy"
            checked={data.agreePrivacy}
            onChange={(e) => onChange("agreePrivacy", e.target.checked)}
          />
          <span>
            <Label className="mb-0.5 cursor-pointer">
              개인정보 수집 및 이용 동의 *
            </Label>
            <p className="text-xs leading-relaxed text-slate-500">
              지원 심사·배정 연락을 위해 성함, 연락처, 자격 정보를 수집합니다.
            </p>
          </span>
        </label>
        <FieldError message={errors.agreePrivacy} />

        <label
          className={cn(
            "flex cursor-pointer items-start gap-3 rounded-2xl border-2 p-4 transition-colors",
            data.agreeTerms
              ? "border-navy bg-navy/[0.03]"
              : "border-slate-200 bg-white"
          )}
        >
          <input
            type="checkbox"
            className="mt-1 h-5 w-5 accent-navy"
            checked={data.agreeTerms}
            onChange={(e) => onChange("agreeTerms", e.target.checked)}
          />
          <span>
            <Label className="mb-0.5 cursor-pointer">
              활동 약관 및 비밀유지 동의 *
            </Label>
            <p className="text-xs leading-relaxed text-slate-500">
              환자·보호자 정보는 업무 목적 외 사용·유출을 금지하며, 배정 후
              VIP 진료 리포트 작성 의무에 동의합니다.
            </p>
          </span>
        </label>
        <FieldError message={errors.agreeTerms} />
      </div>
    </div>
  );
}
