"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chip, FieldError } from "@/components/ui/chip";
import {
  MANAGER_GENDER_OPTIONS,
  REGION_SUGGESTIONS,
  type ManagerFormData,
} from "@/lib/manager";
import { formatPhone } from "@/lib/utils";

type Errors = Partial<Record<keyof ManagerFormData, string>>;

interface Props {
  data: ManagerFormData;
  errors: Errors;
  onChange: <K extends keyof ManagerFormData>(
    key: K,
    value: ManagerFormData[K]
  ) => void;
}

export function StepProfile({ data, errors, onChange }: Props) {
  return (
    <div className="space-y-5">
      <div>
        <Label htmlFor="fullName">성함 *</Label>
        <Input
          id="fullName"
          autoComplete="name"
          placeholder="홍길동"
          value={data.fullName}
          onChange={(e) => onChange("fullName", e.target.value)}
          aria-invalid={Boolean(errors.fullName)}
        />
        <FieldError message={errors.fullName} />
      </div>

      <div>
        <Label htmlFor="phone">연락처 *</Label>
        <Input
          id="phone"
          type="tel"
          inputMode="numeric"
          autoComplete="tel"
          placeholder="010-1234-5678"
          value={data.phone}
          onChange={(e) => onChange("phone", formatPhone(e.target.value))}
          aria-invalid={Boolean(errors.phone)}
        />
        <FieldError message={errors.phone} />
      </div>

      <div>
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          autoComplete="email"
          placeholder="manager@example.com"
          value={data.email}
          onChange={(e) => onChange("email", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label htmlFor="birthYear">출생 연도</Label>
          <Input
            id="birthYear"
            inputMode="numeric"
            placeholder="1990"
            maxLength={4}
            value={data.birthYear}
            onChange={(e) =>
              onChange(
                "birthYear",
                e.target.value.replace(/\D/g, "").slice(0, 4)
              )
            }
          />
        </div>
        <div>
          <Label>성별</Label>
          <div className="flex flex-wrap gap-2">
            {MANAGER_GENDER_OPTIONS.map((g) => (
              <Chip
                key={g}
                selected={data.gender === g}
                onClick={() => onChange("gender", g)}
                className="flex-1"
              >
                {g}
              </Chip>
            ))}
          </div>
        </div>
      </div>

      <div>
        <Label htmlFor="region">활동 가능 지역 *</Label>
        <Input
          id="region"
          placeholder="예: 서울 강남/서초"
          value={data.region}
          onChange={(e) => onChange("region", e.target.value)}
          aria-invalid={Boolean(errors.region)}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {REGION_SUGGESTIONS.map((r) => (
            <Chip
              key={r}
              selected={data.region === r}
              onClick={() => onChange("region", r)}
              className="h-10 text-xs"
            >
              {r}
            </Chip>
          ))}
        </div>
        <FieldError message={errors.region} />
      </div>
    </div>
  );
}
