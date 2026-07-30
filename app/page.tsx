import { BookingWizard } from "@/components/booking/BookingWizard";
import { ShieldCheck, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-lg flex-col px-5 pb-2 pt-[max(1.25rem,env(safe-area-inset-top))]">
      <header className="mb-6 flex items-center justify-between">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-royal">
            Premium Hospital Escort
          </p>
          <h1 className="mt-1 text-[1.65rem] font-extrabold leading-none tracking-tight text-navy">
            MediBlack
          </h1>
          <p className="mt-1 text-sm font-medium text-slate-500">메디블랙</p>
        </div>
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-navy text-gold shadow-md">
          <Sparkles className="h-5 w-5" strokeWidth={2} />
        </div>
      </header>

      <div className="mb-5 flex items-center gap-2 rounded-2xl bg-white/70 px-3.5 py-2.5 text-xs font-medium text-slate-600 shadow-sm ring-1 ring-slate-100 backdrop-blur">
        <ShieldCheck className="h-4 w-4 shrink-0 text-royal" />
        가입 없이 바로 접수 · 전문 매니저 1시간 내 연락
      </div>

      <section className="flex flex-1 flex-col rounded-[1.75rem] bg-white p-5 shadow-[0_8px_40px_-12px_rgba(15,23,42,0.12)] ring-1 ring-slate-100/80">
        <BookingWizard />
      </section>

      <footer className="py-5 text-center text-[11px] text-slate-400">
        © {new Date().getFullYear()} MediBlack. All rights reserved.
      </footer>
    </main>
  );
}
