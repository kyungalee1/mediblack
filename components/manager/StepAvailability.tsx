"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Chip, FieldError } from "@/components/ui/chip";
import {
  DAY_OPTIONS,
  LANGUAGE_OPTIONS,
  type AvailableDay,
  type Language,
  type ManagerFormData,
} from "@/lib/manager";

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

export function StepAvailability({ data, errors, onChange }: Props) {
  const toggleDay = (day: AvailableDay) => {
    onChange("availableDays", toggleItem(data.availableDays, day));
  };

  const toggleLang = (lang: Language) => {
    onChange("languages", toggleItem(data.languages, lang));
  };

  return (
    <div className="space-y-5">
      <div>
        <Label>활동 가능 요일 * (복수 선택)</Label>
        <div className="mt-1 grid grid-cols-4 gap-2 sm:grid-cols-7">
          {DAY_OPTIONS.map((day) => (
            <Chip
              key={day}
              selected={data.availableDays.includes(day)}
              onClick={() => toggleDay(day)}
              className="px-0"
            >
              {day}
            </Chip>
          ))}
        </div>
        <FieldError message={errors.availableDays} />
      </div>

      <div>
        <Label>가능 언어</Label>
        <div className="mt-1 flex flex-wrap gap-2">
          {LANGUAGE_OPTIONS.map((lang) => (
            <Chip
              key={lang}
              selected={data.languages.includes(lang)}
              onClick={() => toggleLang(lang)}
            >
              {lang}
            </Chip>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="preferredHospitals">선호 병원 / 권역</Label>
        <Input
          id="preferredHospitals"
          placeholder="예: 서울아산병원, 삼성서울병원"
          value={data.preferredHospitals}
          onChange={(e) => onChange("preferredHospitals", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="intro">자기소개</Label>
        <Textarea
          id="intro"
          placeholder="병원 동행·케어 경험, 강점 등을 간단히 적어 주세요."
          value={data.intro}
          onChange={(e) => onChange("intro", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="motivation">지원 동기</Label>
        <Textarea
          id="motivation"
          placeholder="MediBlack 동행 매니저로 활동하고 싶은 이유를 알려 주세요."
          value={data.motivation}
          onChange={(e) => onChange("motivation", e.target.value)}
        />
      </div>
    </div>
  );
}
