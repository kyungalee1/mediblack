"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StepIndicator } from "@/components/manager/StepIndicator";
import { StepProfile } from "@/components/manager/StepProfile";
import { StepCredentials } from "@/components/manager/StepCredentials";
import { StepAvailability } from "@/components/manager/StepAvailability";
import { StepReview } from "@/components/manager/StepReview";
import { SuccessScreen } from "@/components/manager/SuccessScreen";
import {
  createInitialManagerFormData,
  type ManagerFormData,
} from "@/lib/manager";
import { generateApplicationNumber } from "@/lib/utils";

type Errors = Partial<Record<keyof ManagerFormData, string>>;

function validateStep(step: number, data: ManagerFormData): Errors {
  const errors: Errors = {};

  if (step === 1) {
    if (!data.fullName.trim()) errors.fullName = "성함을 입력해 주세요.";
    if (data.phone.replace(/\D/g, "").length < 10)
      errors.phone = "올바른 연락처를 입력해 주세요.";
    if (!data.region.trim()) errors.region = "활동 가능 지역을 입력해 주세요.";
  }

  if (step === 2) {
    if (data.certifications.length === 0)
      errors.certifications = "자격증을 하나 이상 선택해 주세요.";
    if (
      data.certifications.includes("기타") &&
      !data.otherCertification.trim()
    ) {
      errors.otherCertification = "기타 자격을 입력해 주세요.";
    }
    if (!data.experienceYears)
      errors.experienceYears = "경력을 선택해 주세요.";
  }

  if (step === 3) {
    if (data.availableDays.length === 0)
      errors.availableDays = "활동 가능 요일을 선택해 주세요.";
  }

  if (step === 4) {
    if (!data.agreePrivacy)
      errors.agreePrivacy = "개인정보 수집 동의가 필요합니다.";
    if (!data.agreeTerms) errors.agreeTerms = "활동 약관 동의가 필요합니다.";
  }

  return errors;
}

const STEP_TITLES = [
  "인적사항",
  "자격 · 경력",
  "활동 조건",
  "지원 확인 및 제출",
];

export function ApplyWizard() {
  const [step, setStep] = useState(1);
  const [direction, setDirection] = useState(1);
  const [data, setData] = useState<ManagerFormData>(() =>
    createInitialManagerFormData(generateApplicationNumber())
  );
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [submittedRef, setSubmittedRef] = useState<string | null>(null);

  const onChange = <K extends keyof ManagerFormData>(
    key: K,
    value: ManagerFormData[K]
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

    setSubmitting(true);
    setSubmitError("");

    try {
      const res = await fetch("/api/managers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          application_number: data.applicationNumber,
          full_name: data.fullName.trim(),
          phone: data.phone,
          email: data.email.trim() || null,
          birth_year: data.birthYear.trim() || null,
          gender: data.gender || null,
          region: data.region.trim(),
          certifications: data.certifications,
          other_certification: data.otherCertification.trim() || null,
          experience_years: data.experienceYears || null,
          specialty_areas: data.specialtyAreas,
          languages: data.languages,
          available_days: data.availableDays,
          preferred_hospitals: data.preferredHospitals.trim() || null,
          intro: data.intro.trim() || null,
          motivation: data.motivation.trim() || null,
          agree_privacy: data.agreePrivacy,
          agree_terms: data.agreeTerms,
          status: "PENDING",
        }),
      });

      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error || "지원에 실패했습니다.");
      }

      setSubmittedRef(
        (json.application_number as string) || data.applicationNumber
      );
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "지원 중 오류가 발생했습니다."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const onReset = () => {
    setData(createInitialManagerFormData(generateApplicationNumber()));
    setErrors({});
    setSubmitError("");
    setSubmittedRef(null);
    setDirection(1);
    setStep(1);
  };

  if (submittedRef) {
    return <SuccessScreen applicationRef={submittedRef} onReset={onReset} />;
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col">
      <div className="mb-6">
        <StepIndicator current={step} />
        <p className="mt-4 text-xs font-semibold uppercase tracking-wider text-teal">
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
              <StepProfile data={data} errors={errors} onChange={onChange} />
            )}
            {step === 2 && (
              <StepCredentials
                data={data}
                errors={errors}
                onChange={onChange}
              />
            )}
            {step === 3 && (
              <StepAvailability
                data={data}
                errors={errors}
                onChange={onChange}
              />
            )}
            {step === 4 && (
              <StepReview data={data} errors={errors} onChange={onChange} />
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {submitError && (
        <p
          className="mt-4 rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700"
          role="alert"
        >
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
                  제출 중…
                </>
              ) : (
                "지원 제출하기"
              )}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
