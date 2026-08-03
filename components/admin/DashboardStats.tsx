"use client";

import { useEffect, useState } from "react";

interface Stats {
  bookingsTotal: number;
  bookingsPending: number;
  managersTotal: number;
  managersPending: number;
  mock?: boolean;
}

export function DashboardStats() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(async (res) => {
        const json = await res.json();
        if (!res.ok) throw new Error(json.error || "통계 로드 실패");
        setStats(json);
      })
      .catch((err) =>
        setError(err instanceof Error ? err.message : "통계 로드 실패")
      );
  }, []);

  if (error) {
    return (
      <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
        {error}
      </p>
    );
  }

  if (!stats) {
    return (
      <p className="text-sm text-slate-400">현황을 불러오는 중…</p>
    );
  }

  const cards = [
    {
      label: "보호자 접수",
      value: stats.bookingsTotal,
      sub: `대기 ${stats.bookingsPending}`,
      tone: "text-royal",
    },
    {
      label: "동행 Manager",
      value: stats.managersTotal,
      sub: `심사 대기 ${stats.managersPending}`,
      tone: "text-teal",
    },
  ];

  return (
    <div className="space-y-3">
      {stats.mock && (
        <p className="rounded-2xl bg-amber-50 px-4 py-2 text-sm text-amber-900">
          Supabase 미연결 — 목업 수치입니다.
        </p>
      )}
      <div className="grid gap-3 sm:grid-cols-2">
        {cards.map((c) => (
          <div
            key={c.label}
            className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-slate-200"
          >
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400">
              {c.label}
            </p>
            <p className={`mt-2 text-3xl font-extrabold ${c.tone}`}>
              {c.value}
            </p>
            <p className="mt-1 text-sm text-slate-500">{c.sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
