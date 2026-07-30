"use client";

import { motion } from "framer-motion";
import { CheckCircle2, Clock, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";

interface SuccessScreenProps {
  bookingRef: string;
  onReset: () => void;
}

export function SuccessScreen({ bookingRef, onReset }: SuccessScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center px-1 pb-8 pt-4 text-center"
    >
      <motion.div
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 18 }}
        className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
      >
        <CheckCircle2 className="h-11 w-11" strokeWidth={1.75} />
      </motion.div>

      <h1 className="mt-6 text-2xl font-extrabold tracking-tight text-navy">
        접수가 완료되었습니다
      </h1>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-slate-500">
        담당 전문가가{" "}
        <span className="font-semibold text-navy">1시간 내로 연락</span>
        드립니다. 잠시만 기다려 주세요.
      </p>

      <div className="mt-6 w-full rounded-3xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-4">
        <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          접수 번호
        </p>
        <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-navy">
          {bookingRef}
        </p>
      </div>

      <ul className="mt-6 w-full space-y-3 text-left">
        <li className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-royal" />
          <div>
            <p className="text-sm font-bold text-navy">다음 단계</p>
            <p className="mt-0.5 text-sm text-slate-500">
              전문 동행 매니저가 일정·요금제를 확인하고 안내드립니다.
            </p>
          </div>
        </li>
        <li className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm ring-1 ring-slate-100">
          <Phone className="mt-0.5 h-5 w-5 shrink-0 text-royal" />
          <div>
            <p className="text-sm font-bold text-navy">연락 준비</p>
            <p className="mt-0.5 text-sm text-slate-500">
              신청하신 번호로 전화가 올 수 있으니 수신을 확인해 주세요.
            </p>
          </div>
        </li>
      </ul>

      <InstallPrompt className="mt-6 w-full text-left" />

      <Button
        type="button"
        variant="secondary"
        className="mt-6 w-full"
        onClick={onReset}
      >
        새 접수하기
      </Button>
    </motion.div>
  );
}
