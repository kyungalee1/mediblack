import Link from "next/link";
import { ClipboardList, HeartHandshake } from "lucide-react";
import { DashboardStats } from "@/components/admin/DashboardStats";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">대시보드</h1>
        <p className="mt-1 text-sm text-slate-500">
          접수와 매니저 지원 현황을 한눈에 확인합니다.
        </p>
      </div>

      <DashboardStats />

      <div className="grid gap-4 sm:grid-cols-2">
        <Link
          href="/admin/bookings"
          className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:ring-navy/30"
        >
          <ClipboardList className="h-6 w-6 text-royal" />
          <p className="mt-3 font-bold">보호자 접수 관리</p>
          <p className="mt-1 text-sm text-slate-500">
            예약번호·병원·요금제·상태 변경
          </p>
        </Link>
        <Link
          href="/admin/managers"
          className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200 transition hover:ring-teal/40"
        >
          <HeartHandshake className="h-6 w-6 text-teal" />
          <p className="mt-3 font-bold">동행 Manager 지원</p>
          <p className="mt-1 text-sm text-slate-500">
            자격·경력 검토 및 승인/반려
          </p>
        </Link>
      </div>

      <div className="rounded-3xl bg-white p-5 text-sm text-slate-600 shadow-sm ring-1 ring-slate-200">
        <p className="font-bold text-navy">바로가기</p>
        <ul className="mt-2 list-disc space-y-1 pl-5">
          <li>
            접수 앱:{" "}
            <Link href="/" className="font-semibold text-royal underline">
              /
            </Link>
          </li>
          <li>
            매니저 지원:{" "}
            <Link href="/manager" className="font-semibold text-teal underline">
              /manager
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
