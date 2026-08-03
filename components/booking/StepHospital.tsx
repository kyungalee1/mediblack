"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Chip, FieldError } from "@/components/ui/chip";
import { HOSPITAL_SUGGESTIONS, TRANSPORT_OPTIONS, TRANSPORT_OPTION_HINT, type BookingFormData } from "@/lib/types";

interface StepHospitalProps {
  data: BookingFormData;
  errors: Partial<Record<keyof BookingFormData, string>>;
  onChange: <K extends keyof BookingFormData>(
    key: K,
    value: BookingFormData[K]
  ) => void;
}

export function StepHospital({ data, errors, onChange }: StepHospitalProps) {
  return (
    <div className="space-y-5">
      <h2 className="text-lg font-bold text-navy">병원 및 진료 정보</h2>

      <div>
        <Label htmlFor="hospitalName">병원명</Label>
        <Input
          id="hospitalName"
          name="hospitalName"
          placeholder="예: 서울아산병원"
          value={data.hospitalName}
          onChange={(e) => onChange("hospitalName", e.target.value)}
          aria-invalid={Boolean(errors.hospitalName)}
        />
        <div className="mt-2 flex flex-wrap gap-2">
          {HOSPITAL_SUGGESTIONS.map((name) => (
            <Chip
              key={name}
              selected={data.hospitalName === name}
              onClick={() =>
                onChange("hospitalName", name === "기타" ? "" : name)
              }
              className="h-10 text-xs"
            >
              {name}
            </Chip>
          ))}
        </div>
        <FieldError message={errors.hospitalName} />
      </div>

      <div>
        <Label htmlFor="department">진료과</Label>
        <Input
          id="department"
          name="department"
          placeholder="예: 순환기내과, 암센터"
          value={data.department}
          onChange={(e) => onChange("department", e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <Label htmlFor="appointmentDate">병원 예약 날짜</Label>
          <Input
            id="appointmentDate"
            name="appointmentDate"
            type="date"
            value={data.appointmentDate}
            onChange={(e) => onChange("appointmentDate", e.target.value)}
            aria-invalid={Boolean(errors.appointmentDate)}
            min={new Date().toISOString().slice(0, 10)}
          />
          <FieldError message={errors.appointmentDate} />
        </div>
        <div>
          <Label htmlFor="appointmentTime">병원 예약 시간</Label>
          <Input
            id="appointmentTime"
            name="appointmentTime"
            type="time"
            value={data.appointmentTime}
            onChange={(e) => onChange("appointmentTime", e.target.value)}
          />
        </div>
      </div>
      <p className="-mt-2 text-xs text-slate-500">
        병원에 이미 잡힌 진료 예약 날짜·시간을 입력해 주세요.
      </p>

      <div>
        <Label htmlFor="medicalCondition">주요 질환 및 상태</Label>
        <Textarea
          id="medicalCondition"
          name="medicalCondition"
          placeholder="예: 고혈압·당뇨 관리 중, 보행 시 보조 필요"
          value={data.medicalCondition}
          onChange={(e) => onChange("medicalCondition", e.target.value)}
        />
      </div>

      <div>
        <Label>병원 이동수단</Label>
        <p className="mb-2 text-xs text-slate-500">
          환자와 매니저가 병원까지 이동하는 방법을 선택해 주세요.
        </p>
        <div className="flex flex-col gap-2">
          {TRANSPORT_OPTIONS.map((option) => {
            const selected = data.transportMethod === option;
            return (
              <Chip
                key={option}
                selected={selected}
                onClick={() => onChange("transportMethod", option)}
                className="h-auto min-h-11 justify-start px-4 py-2.5 text-left text-sm"
              >
                <span className="flex flex-col items-start gap-0.5">
                  <span className="font-semibold">{option}</span>
                  <span
                    className={
                      selected
                        ? "text-[11px] font-normal text-white/75"
                        : "text-[11px] font-normal text-slate-500"
                    }
                  >
                    {TRANSPORT_OPTION_HINT[option]}
                  </span>
                </span>
              </Chip>
            );
          })}
        </div>
        <FieldError message={errors.transportMethod} />
      </div>

      <div>
        <Label htmlFor="specialRequests">요청사항</Label>
        <Textarea
          id="specialRequests"
          name="specialRequests"
          placeholder="이동 보조, 휠체어 필요 여부, 동행 시 유의사항 등"
          value={data.specialRequests}
          onChange={(e) => onChange("specialRequests", e.target.value)}
        />
      </div>

      <div>
        <Label htmlFor="doctorQuestions">의사선생님께 여쭐 내용</Label>
        <Textarea
          id="doctorQuestions"
          name="doctorQuestions"
          placeholder="진료 시 의사선생님께 여쭙고 싶은 질문이나 전달할 내용을 적어 주세요."
          value={data.doctorQuestions}
          onChange={(e) => onChange("doctorQuestions", e.target.value)}
        />
      </div>
    </div>
  );
}
