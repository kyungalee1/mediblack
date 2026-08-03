import { redirect } from "next/navigation";
import { isAdminAuthenticated, isAdminConfigured } from "@/lib/admin-auth";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export default async function AdminEntryPage() {
  if (await isAdminAuthenticated()) {
    redirect("/admin/dashboard");
  }

  return (
    <main className="mx-auto flex min-h-dvh w-full max-w-md flex-col justify-center px-5 py-10">
      <div className="rounded-3xl bg-white p-7 shadow-sm ring-1 ring-slate-200">
        <p className="text-xs font-bold uppercase tracking-[0.18em] text-royal">
          MediBlack Ops
        </p>
        <h1 className="mt-2 text-2xl font-extrabold tracking-tight">
          관리자 로그인
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          보호자 접수 · 동행 Manager 지원을 한곳에서 관리합니다.
        </p>

        {!isAdminConfigured() ? (
          <p className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-900">
            <code className="font-mono">ADMIN_PASSWORD</code> 환경변수를
            설정한 뒤 서버를 재시작하세요.
          </p>
        ) : (
          <AdminLoginForm />
        )}
      </div>
    </main>
  );
}
