import Link from "next/link";
import { ApplyWizard } from "@/components/manager/ApplyWizard";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { HeartHandshake, ShieldCheck } from "lucide-react";

export function ManagerApplyPage() {
  return (
    <div className="manager-shell">
      <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pb-2 pt-[max(1.25rem,env(safe-area-inset-top))]">
        <header className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-teal">
              MediBlack Partner
            </p>
            <h1 className="mt-1 text-[1.65rem] font-extrabold leading-none tracking-tight text-navy">
              동행 Manager
            </h1>
            <p className="mt-1 text-sm font-medium text-slate-500">
              프리미엄 병원 동행 파트너 지원
            </p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-teal shadow-md">
            <HeartHandshake className="h-5 w-5" strokeWidth={2} />
          </div>
        </header>

        <div className="mb-5 flex items-center gap-2 rounded-2xl bg-white/70 px-3.5 py-2.5 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-100 backdrop-blur">
          <ShieldCheck className="h-4 w-4 shrink-0 text-teal" />
          자격·경력 등록 후 심사 · 승인 시 MediBlack 배정 연결
        </div>

        <InstallPrompt className="mb-5" variant="manager" />

        <section className="flex flex-1 flex-col rounded-[1.75rem] bg-white p-5 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-100/80">
          <ApplyWizard />
        </section>

        <footer className="space-y-1 py-5 text-center text-[11px] text-slate-400">
          <p>
            <Link
              href="/"
              className="font-medium text-slate-500 underline-offset-2 hover:text-navy hover:underline"
            >
              ← 보호자 접수로 돌아가기
            </Link>
          </p>
          <p>© {new Date().getFullYear()} MediBlack · 동행 Manager</p>
        </footer>
      </main>
    </div>
  );
}
