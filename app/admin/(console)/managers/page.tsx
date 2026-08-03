import { ManagersPanel } from "@/components/admin/ManagersPanel";

export default function AdminManagersPage() {
  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight">동행 Manager</h1>
        <p className="mt-1 text-sm text-slate-500">
          `/manager` 지원서를 심사하고 승인·반려합니다.
        </p>
      </div>
      <ManagersPanel />
    </div>
  );
}
