"use client";

import { BadgeCheck } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chip, FieldError } from "@/components/ui/chip";
import { CERTIFICATION_META } from "@/lib/certifications";
import {
  EXPERIENCE_OPTIONS,
  SPECIALTY_OPTIONS,
  type Certification,
  type ManagerFormData,
  type SpecialtyArea,
} from "@/lib/types";
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

function toggleItem<T>(list: T[], item: T): T[] {
  return list.includes(item) ? list.filter((x) => x !== item) : [...list, item];
}

export function StepCredentials({ data, errors, onChange }: Props) {
  const toggleCert = (cert: Certification) => {
    const next = toggleItem(data.certifications, cert);
    onChange("certifications", next);
    if (!next.includes("기타")) onChange("otherCertification", "");
  };

  const toggleSpecialty = (area: SpecialtyArea) => {
    onChange("specialtyAreas", toggleItem(data.specialtyAreas, area));
  };

  return (
    <div className="space-y-6">
      <div>
        <Label>보유 자격증 * (복수 선택)</Label>
        <p className="mb-3 text-xs text-slate-500">
          업무와 관련된 자격을 모두 선택해 주세요.
        </p>
        <div className="space-y-2">
          {CERTIFICATION_META.map((cert) => {
            const selected = data.certifications.includes(cert.id);
            return (
              <button
                key={cert.id}
                type="button"
                onClick={() => toggleCert(cert.id)}
                aria-pressed={selected}
                className={cn(
                  "flex w-full items-start gap-3 rounded-2xl border-2 px-4 py-3.5 text-left transition-all",
                  selected
                    ? "border-navy bg-navy text-white"
                    : "border-slate-200 bg-white text-navy hover:border-navy/30"
                )}
              >
                <BadgeCheck
                  className={cn(
                    "mt-0.5 h-5 w-5 shrink-0",
                    selected ? "text-gold" : "text-teal"
                  )}
                />
                <span>
                  <span className="block text-sm font-bold">{cert.id}</span>
                  <span
                    className={cn(
                      "mt-0.5 block text-xs",
                      selected ? "text-white/75" : "text-slate-500"
                    )}
                  >
                    {cert.description}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
        <FieldError message={errors.certifications} />
      </div>

      {data.certifications.includes("기타") && (
        <div>
          <Label htmlFor="otherCertification">기타 자격 상세 *</Label>
          <Input
            id="otherCertification"
            placeholder="예: 물리치료사, 약사 등"
            value={data.otherCertification}
            onChange={(e) => onChange("otherCertification", e.target.value)}
            aria-invalid={Boolean(errors.otherCertification)}
          />
          <FieldError message={errors.otherCertification} />
        </div>
      )}

      <div>
        <Label>관련 경력 *</Label>
        <div className="mt-1 flex flex-wrap gap-2">
          {EXPERIENCE_OPTIONS.map((exp) => (
            <Chip
              key={exp}
              selected={data.experienceYears === exp}
              onClick={() => onChange("experienceYears", exp)}
            >
              {exp}
            </Chip>
          ))}
        </div>
        <FieldError message={errors.experienceYears} />
      </div>

      <div>
        <Label>전문·선호 영역 (복수 선택)</Label>
        <div className="mt-1 flex flex-wrap gap-2">
          {SPECIALTY_OPTIONS.map((area) => (
            <Chip
              key={area}
              selected={data.specialtyAreas.includes(area)}
              onClick={() => toggleSpecialty(area)}
            >
              {area}
            </Chip>
          ))}
        </div>
      </div>
    </div>
  );
}
