"use client";

import { useCallback, useEffect, useState } from "react";
import {
  MANAGER_STATUSES,
  MANAGER_STATUS_LABEL,
  type AdminManager,
  type ManagerStatus,
} from "@/lib/admin-types";
import { StatusBadge } from "@/components/admin/StatusBadge";

export function ManagersPanel() {
  const [items, setItems] = useState<AdminManager[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState<string>("ALL");
  const [selected, setSelected] = useState<AdminManager | null>(null);
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/managers");
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

  const open = (m: AdminManager) => {
    setSelected(m);
    setNotes(m.notes || "");
  };

  const filtered =
    filter === "ALL" ? items : items.filter((m) => m.status === filter);

  const update = async (
    id: string,
    patch: { status?: ManagerStatus; notes?: string }
  ) => {
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/managers/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(patch),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "저장 실패");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "저장 실패");
    } finally {
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!selected) return;
    const fresh = items.find((m) => m.id === selected.id);
    if (fresh) {
      setSelected(fresh);
      setNotes(fresh.notes || "");
    }
  }, [items]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <FilterChip
          active={filter === "ALL"}
          onClick={() => setFilter("ALL")}
          label={`전체 ${items.length}`}
        />
        {MANAGER_STATUSES.map((s) => (
          <FilterChip
            key={s}
            active={filter === s}
            onClick={() => setFilter(s)}
            label={`${MANAGER_STATUS_LABEL[s]} ${items.filter((m) => m.status === s).length}`}
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
          지원 건이 없습니다.
        </p>
      ) : (
        <div className="overflow-hidden rounded-3xl bg-white ring-1 ring-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full text-left text-sm">
              <thead className="bg-slate-50 text-xs font-bold uppercase tracking-wider text-slate-400">
                <tr>
                  <th className="px-4 py-3">지원번호</th>
                  <th className="px-4 py-3">성함 · 연락처</th>
                  <th className="px-4 py-3">지역 · 경력</th>
                  <th className="px-4 py-3">매핑 환자</th>
                  <th className="px-4 py-3">상태</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr
                    key={m.id}
                    className="cursor-pointer border-t border-slate-100 hover:bg-slate-50"
                    onClick={() => open(m)}
                  >
                    <td className="px-4 py-3 font-mono text-xs font-semibold">
                      {m.application_number}
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold">{m.full_name}</p>
                      <p className="text-xs text-slate-500">{m.phone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-medium">{m.region}</p>
                      <p className="text-xs text-slate-500">
                        {m.experience_years || "—"}
                      </p>
                    </td>
                    <td className="px-4 py-3">
                      {m.active_booking ? (
                        <>
                          <p className="font-semibold text-navy">
                            {m.active_booking.patient_name}
                          </p>
                          <p className="text-xs text-slate-500">
                            {m.active_booking.booking_number} ·{" "}
                            {m.active_booking.hospital_name}
                          </p>
                        </>
                      ) : m.status === "ACCOMPANYING" ? (
                        <span className="text-xs text-amber-600">
                          배정 정보 없음
                        </span>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge
                        status={m.status}
                        label={
                          MANAGER_STATUS_LABEL[m.status as ManagerStatus] ||
                          m.status
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
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-6">
          <button
            type="button"
            className="absolute inset-0"
            aria-label="닫기"
            onClick={() => setSelected(null)}
          />
          <div className="relative z-10 max-h-[85dvh] w-full max-w-lg overflow-y-auto rounded-t-3xl bg-white p-5 shadow-xl sm:rounded-3xl">
            <div className="mb-4 flex items-start justify-between gap-3">
              <h2 className="text-lg font-extrabold">
                {selected.application_number}
              </h2>
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="rounded-xl bg-slate-100 px-3 py-1.5 text-sm font-semibold"
              >
                닫기
              </button>
            </div>

            {selected.active_booking && (
              <div className="mb-4 rounded-2xl border-2 border-violet-200 bg-violet-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wider text-violet-600">
                  현재 매핑된 환자
                </p>
                <p className="mt-1 text-base font-extrabold text-navy">
                  {selected.active_booking.patient_name}
                </p>
                <p className="text-sm text-slate-600">
                  {selected.active_booking.booking_number} ·{" "}
                  {selected.active_booking.hospital_name} ·{" "}
                  {selected.active_booking.appointment_date}
                </p>
              </div>
            )}

            <dl className="space-y-2 text-sm">
              <Row k="성함" v={selected.full_name} />
              <Row k="연락처" v={selected.phone} />
              <Row k="성별" v={selected.gender || "—"} />
              <Row k="이메일" v={selected.email || "—"} />
              <Row k="지역" v={selected.region} />
              <Row k="경력" v={selected.experience_years || "—"} />
              <Row
                k="자격"
                v={(selected.certifications || []).join(", ") || "—"}
              />
              <Row k="기타 자격" v={selected.other_certification || "—"} />
              <Row
                k="전문 영역"
                v={(selected.specialty_areas || []).join(", ") || "—"}
              />
              <Row
                k="가능 요일"
                v={(selected.available_days || []).join(", ") || "—"}
              />
              <Row
                k="언어"
                v={(selected.languages || []).join(", ") || "—"}
              />
              <Row k="선호 병원" v={selected.preferred_hospitals || "—"} />
              <Row k="자기소개" v={selected.intro || "—"} />
              <Row k="지원 동기" v={selected.motivation || "—"} />
            </dl>

            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                상태 변경
              </p>
              <div className="flex flex-wrap gap-2">
                {MANAGER_STATUSES.map((s) => (
                  <button
                    key={s}
                    type="button"
                    disabled={saving || selected.status === s}
                    onClick={() => update(selected.id, { status: s })}
                    className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-semibold hover:border-teal disabled:opacity-40"
                  >
                    {MANAGER_STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
              <p className="mt-2 text-xs text-slate-500">
                「동행중」은 보호자 접수에서 매니저 배정 후, 예약 상태를「동행
                중」으로 바꾸면 자동 반영됩니다. 수동으로도 변경할 수 있습니다.
              </p>
            </div>

            <div className="mt-5">
              <p className="mb-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                내부 메모
              </p>
              <textarea
                className="min-h-[90px] w-full rounded-2xl border-2 border-slate-200 px-3 py-2 text-sm"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="면접 일정, 배정 메모 등"
              />
              <button
                type="button"
                disabled={saving}
                onClick={() => update(selected.id, { notes })}
                className="mt-2 rounded-xl bg-navy px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
              >
                메모 저장
              </button>
            </div>
          </div>
        </div>
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
          ? "rounded-full bg-teal px-3 py-1.5 text-xs font-bold text-white"
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
      <dd className="whitespace-pre-wrap font-medium text-navy">{v}</dd>
    </div>
  );
}
