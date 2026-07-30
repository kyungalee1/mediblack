"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chip, FieldError } from "@/components/ui/chip";
import {
  GENDER_OPTIONS,
  RELATIONSHIP_OPTIONS,
  type BookingFormData,
  type PatientGender,
  type Relationship,
} from "@/lib/types";
import { formatPhone } from "@/lib/utils";

interface StepApplicantProps {
  data: BookingFormData;
  errors: Partial<Record<keyof BookingFormData, string>>;
  onChange: <K extends keyof BookingFormData>(
    key: K,
    value: BookingFormData[K]
  ) => void;
}

export function StepApplicant({ data, errors, onChange }: StepApplicantProps) {
  return (
    <div className="space-y-7">
      <section className="space-y-4">
        <h2 className="text-lg font-bold text-navy">신청자 정보</h2>

        <div>
          <Label htmlFor="applicantName">신청자 성함</Label>
          <Input
            id="applicantName"
            name="applicantName"
            autoComplete="name"
            placeholder="홍길동"
            value={data.applicantName}
            onChange={(e) => onChange("applicantName", e.target.value)}
            aria-invalid={Boolean(errors.applicantName)}
          />
          <FieldError message={errors.applicantName} />
        </div>

        <div>
          <Label htmlFor="applicantPhone">신청자 연락처</Label>
          <Input
            id="applicantPhone"
            name="applicantPhone"
            type="tel"
            inputMode="numeric"
            autoComplete="tel"
            placeholder="010-0000-0000"
            value={data.applicantPhone}
            onChange={(e) =>
              onChange("applicantPhone", formatPhone(e.target.value))
            }
            aria-invalid={Boolean(errors.applicantPhone)}
          />
          <FieldError message={errors.applicantPhone} />
        </div>

        <div>
          <Label>환자와의 관계</Label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {RELATIONSHIP_OPTIONS.map((option) => (
              <Chip
                key={option}
                selected={data.relationship === option}
                onClick={() =>
                  onChange("relationship", option as Relationship)
                }
              >
                {option}
              </Chip>
            ))}
          </div>
          <FieldError message={errors.relationship} />
        </div>
      </section>

      <div className="h-px bg-slate-100" />

      <section className="space-y-4">
        <h2 className="text-lg font-bold text-navy">환자 정보</h2>

        <div>
          <Label htmlFor="patientName">환자 성함</Label>
          <Input
            id="patientName"
            name="patientName"
            placeholder="김환자"
            value={data.patientName}
            onChange={(e) => onChange("patientName", e.target.value)}
            aria-invalid={Boolean(errors.patientName)}
          />
          <FieldError message={errors.patientName} />
        </div>

        <div>
          <Label>성별</Label>
          <div className="grid grid-cols-3 gap-2">
            {GENDER_OPTIONS.map((option) => (
              <Chip
                key={option}
                selected={data.patientGender === option}
                onClick={() =>
                  onChange("patientGender", option as PatientGender)
                }
              >
                {option}
              </Chip>
            ))}
          </div>
          <FieldError message={errors.patientGender} />
        </div>

        <div>
          <Label htmlFor="patientAge">나이 / 출생연도</Label>
          <Input
            id="patientAge"
            name="patientAge"
            inputMode="numeric"
            placeholder="예: 72세 또는 1953"
            value={data.patientAge}
            onChange={(e) => onChange("patientAge", e.target.value)}
          />
        </div>

        <div>
          <Label htmlFor="patientPhone">환자 연락처 (선택)</Label>
          <Input
            id="patientPhone"
            name="patientPhone"
            type="tel"
            inputMode="numeric"
            placeholder="010-0000-0000"
            value={data.patientPhone}
            onChange={(e) =>
              onChange("patientPhone", formatPhone(e.target.value))
            }
          />
        </div>
      </section>
    </div>
  );
}
