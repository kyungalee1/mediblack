import { BookingsPanel } from "@/components/admin/BookingsPanel";

export default function AdminBookingsPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">보호자 접수</h1>
        <p className="mt-1 text-sm text-slate-500">
          MediBlack(`/`) 접수를 조회하고 상태를 변경합니다.
        </p>
      </div>
      <BookingsPanel />
    </div>
  );
}
