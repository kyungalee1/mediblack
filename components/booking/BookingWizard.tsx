"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/booking/StepIndicator";
import { StepApplicant } from "@/components/booking/StepApplicant";
import { StepHospital } from "@/components/booking/StepHospital";
import { StepPlan } from "@/components/booking/StepPlan";
import { StepReview } from "@/components/booking/StepReview";
import { SuccessScreen } from "@/components/booking/SuccessScreen";
import { getPlanById } from "@/lib/plans";
import {
  createInitialFormData,
  type BookingFormData,
} from "@/lib/types";
import { generateBookingNumber } from "@/lib/utils";

type Errors = Partial<Record<keyof BookingFormData, string>>;

function validateStep(step: number, data: BookingFormData): Errors {
  const errors: Errors = {};

  if (step === 1) {
    if (!data.applicantName.trim()) errors.applicantName = "신청자 성함을 입력해 주세요.";
    if (data.applicantPhone.replace(/\D/g, "").length < 10)
      errors.applicantPhone = "올바른 연락처를 입력해 주세요.";
    if (!data.relationship) errors.relationship = "환자와의 관계를 선택해 주세요.";
    if (!data.patientName.trim()) errors.patientName = "환자 성함을 입력해 주세요.";
  }

  if (step === 2) {
    if (!data.hospitalName.trim()) errors.hospitalName = "병원명을 입력해 주세요.";
    if (!data.appointmentDate)
      errors.appointmentDate = "병원 예약 날짜를 선택해 주세요.";
    if (!data.transportMethod)
      errors.transportMethod = "병원 이동수단을 선택해 주세요.";
  }

  if (step === 3) {
    if (!data.selectedPlan) errors.selectedPlan = "요금제를 선택해 주세요.";
  }

  if (step === 4) {
    if (!data.agreePrivacy) errors.agreePrivacy = "개인정보 수집 동의가 필요합니다.";
    if (!data.agreeLiability)
      errors.agreeLiability = "배상책임 및 한계 안내 동의가 필요합니다.";
  }

  return errors;
}

const STEP_TITLES = [
  "신청자 및 환자 정보",
  "병원 및 질환 정보",
  "VIP 요금제 선택",
  "접수 확인 및 제출",
];

export function BookingWizard() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<BookingFormData>(() =>
    createInitialFormData(generateBookingNumber())
  );
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const onChange = <K extends keyof BookingFormData>(
    key: K,
    value: BookingFormData[K]
  ) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const goNext = () => {
    const nextErrors = validateStep(step, data);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }
    setErrors({});
    setDirection(1);
    setStep((s) => Math.min(4, s + 1));
  };

  const goBack = () => {
    setErrors({});
    setDirection(-1);
    setStep((s) => Math.max(1, s - 1));
  };

  const onSubmit = async () => {
    const nextErrors = validateStep(4, data);
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    const plan = getPlanById(data.selectedPlan);
    if (!plan) return;

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          booking_number: data.bookingNumber,
          applicant_name: data.applicantName.trim(),
          applicant_phone: data.applicantPhone,
          relationship: data.relationship,
          patient_name: data.patientName.trim(),
          patient_gender: data.patientGender || null,
          patient_age: data.patientAge.trim() || null,
          patient_phone: data.patientPhone || null,
          hospital_name: data.hospitalName.trim(),
          department: data.department.trim() || null,
          appointment_date: data.appointmentDate,
          appointment_time: data.appointmentTime || null,
          medical_condition: data.medicalCondition.trim() || null,
          transport_method: data.transportMethod || null,
          special_requests: data.specialRequests.trim() || null,
          doctor_questions: data.doctorQuestions.trim() || null,
          selected_plan: plan.name,
          price: plan.price,
          status: "PENDING",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "접수에 실패했습니다.");
      }

      setSubmittedRef(
        (json.booking_number as string) || data.bookingNumber
      );
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "접수 중 오류가 발생했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = () => {
    setData(createInitialFormData(generateBookingNumber()));
    setErrors({});
    setSubmitError("");
    setSubmittedRef(null);
    setDirection(1);
    setStep(1);
  };

  if (submittedRef) {
    return <SuccessScreen bookingRef={submittedRef} onReset={onReset} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-6">
        <StepIndicator current={step} />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-royal">
          Step {step} / 4
        </p>
        <h1 className="mt-1 text-2xl font-extrabold tracking-tight text-navy">
          {STEP_TITLES[step - 1]}
        </h1>
      </div>

      <div className="relative flex-1 overflow-hidden">
        <AnimatePresence mode="wait" custom={direction}>
          <motion.div
            key={step}
            custom={direction}
            initial={{ opacity: 0, x: direction > 0 ? 28 : -28 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: direction > 0 ? -28 : 28 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            {step === 1 && (
              <StepApplicant data={data} errors={errors} onChange={onChange} />
            )}
            {step === 2 && (
              <StepHospital data={data} errors={errors} onChange={onChange} />
            )}
            {step === 3 && (
              <StepPlan data={data} errors={errors} onChange={onChange} />
            )}
            {step === 4 && (
              <StepReview data={data} errors={errors} onChange={onChange} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {submitError && (
        <p className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700" role="alert">
          {submitError}
        </p>
      )}

      <div className="sticky bottom-0 -mx-5 mt-8 border-t border-slate-100 bg-white/90 px-5 py-4 backdrop-blur-md safe-bottom">
        <div className="flex gap-3">
          {step > 1 ? (
            <Button
              type="button"
              variant="secondary"
              className="shrink-0"
              onClick={goBack}
              disabled={submitting}
              aria-label="이전"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
          ) : null}

          {step < 4 ? (
            <Button type="button" className="flex-1" onClick={goNext}>
              다음
              <ArrowRight className="h-5 w-5" />
            </Button>
          ) : (
            <Button
              type="button"
              className="flex-1"
              onClick={onSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  접수 중…
                </>
              ) : (
                "접수 제출하기"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
