"use client";

import { useCallback, useEffect, useState } from "react";
import {
  BOOKING_STATUSES,
  BOOKING_STATUS_LABEL,
  type AdminBooking,
  type BookingStatus,
} from "@/lib/admin-types";
import { formatPrice } from "@/lib/utils";
import { StatusBadge } from "@/components/admin/StatusBadge";

export function BookingsPanel() {
  const [items, setItems] = useState<AdminBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("ALL");
  const [selected, setSelected] = useState<AdminBooking | null>(null);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/bookings");
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "목록 로드 실패");
      setItems(json.items || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "목록 로드 실패");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const filtered =
    filter === "ALL" ? items : items.filter((b) => b.status === filter);

  const updateStatus = async (id: string, status: BookingStatus) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "상태 변경 실패");
      setItems((prev) =>
        prev.map((b) => (b.id === id ? { ...b, status: json.status } : b))
      );
      setSelected((prev) =>
        prev && prev.id === id ? { ...prev, status: json.status } : prev
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "상태 변경 실패");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={filter === "ALL"}
          onClick={() => setFilter("ALL")}
          label={`전체 ${items.length}`}
        />
        {BOOKING_STATUSES.map((s) => (
          <FilterChip
            key={s}
            active={filter === s}
            onClick={() => setFilter(s)}
            label={`${BOOKING_STATUS_LABEL[s]} ${items.filter((b) => b.status === s).length}`}
          />
        ))}
      </div>

      {error && (
        <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </p>
      )}

      {loading ? (
        <p className="text-sm text-slate-400">불러오는 중…</p>
      ) : filtered.length === 0 ? (
        <p className="rounded-3xl bg-white px-5 py-10 text-center text-sm text-slate-500 ring-1 ring-slate-200">
          접수 건이 없습니다.
        </p>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">예약번호</th>
                  <th className="px-4 py-3">환자 / 신청자</th>
                  <th className="px-4 py-3">병원 · 일정</th>
                  <th className="px-4 py-3">요금제</th>
                  <th className="px-4 py-3">상태</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr
                    key={b.id}
                    className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                    onClick={() => setSelected(b)}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-semibold">
                      {b.booking_number}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{b.patient_name}</p>
                      <p className="text-xs text-slate-500">
                        {b.applicant_name} · {b.applicant_phone}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{b.hospital_name}</p>
                      <p className="text-xs text-slate-500">
                        {b.appointment_date}
                        {b.appointment_time ? ` ${b.appointment_time}` : ""}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <p>{b.selected_plan}</p>
                      <p className="text-xs text-slate-500">
                        {formatPrice(b.price)}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={b.status}
                        label={
                          BOOKING_STATUS_LABEL[b.status as BookingStatus] ||
                          b.status
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <DetailDrawer
          title={`접수 ${selected.booking_number}`}
          onClose={() => setSelected(null)}
        >
          <dl className="space-y-2 text-sm">
            <Row k="환자" v={selected.patient_name} />
            <Row k="신청자" v={`${selected.applicant_name} (${selected.relationship})`} />
            <Row k="연락처" v={selected.applicant_phone} />
            <Row k="병원" v={`${selected.hospital_name} ${selected.department || ""}`} />
            <Row
              k="일정"
              v={`${selected.appointment_date} ${selected.appointment_time || ""}`}
            />
            <Row k="요금제" v={`${selected.selected_plan} · ${formatPrice(selected.price)}`} />
            <Row k="질환" v={selected.medical_condition || "—"} />
            <Row k="특이사항" v={selected.special_requests || "—"} />
            <Row k="의사 질문" v={selected.doctor_questions || "—"} />
          </dl>
          <div className="mt-5">
            <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              상태 변경
            </p>
            <div className="flex flex-wrap gap-2">
              {BOOKING_STATUSES.map((s) => (
                <button
                  key={s}
                  type="button"
                  disabled={saving || selected.status === s}
                  onClick={() => updateStatus(selected.id, s)}
                  className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold hover:border-navy disabled:opacity-40"
                >
                  {BOOKING_STATUS_LABEL[s]}
                </button>
              ))}
            </div>
          </div>
        </DetailDrawer>
      )}
    </div>
  );
}

function FilterChip({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={
        active
          ? "rounded-full bg-navy px-3 py-1.5 text-xs font-bold text-white"
          : "rounded-full bg-white px-3 py-1.5 text-xs font-semibold text-slate-600 ring-1 ring-slate-200"
      }
    >
      {label}
    </button>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex gap-3 border-b border-slate-100 py-2">
      <dt className="w-20 shrink-0 text-xs font-semibold text-slate-400">{k}</dt>
      <dd className="font-medium text-navy">{v}</dd>
    </div>
  );
}

function DetailDrawer({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-6">
      <button
        type="button"
        className="absolute inset-0 cursor-default"
        aria-label="닫기"
        onClick={onClose}
      />
      <div className="relative z-10 max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl">
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 className="text-lg font-extrabold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-slate-100 px-3 py-1.5 text-sm font-semibold"
          >
            닫기
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}
