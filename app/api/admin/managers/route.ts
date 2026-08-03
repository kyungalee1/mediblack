import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import type {
  AdminManager,
  AdminManagerActiveBooking,
} from "@/lib/admin-types";
import {
  getSupabaseAdmin,
  isAdminDbConfigured,
} from "@/lib/supabase-admin";

type ActiveAssignRow = {
  manager_id: string;
  status: string;
  booking_id: string;
  bookings:
    | {
        id: string;
        booking_number: string;
        patient_name: string;
        hospital_name: string;
        appointment_date: string;
      }
    | {
        id: string;
        booking_number: string;
        patient_name: string;
        hospital_name: string;
        appointment_date: string;
      }[]
    | null;
};

function bookingFromJoin(bookings: ActiveAssignRow["bookings"]) {
  if (!bookings) return null;
  return Array.isArray(bookings) ? bookings[0] ?? null : bookings;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!isAdminDbConfigured()) {
    return NextResponse.json({ items: [], mock: true });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("managers")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("[admin/managers]", error);
    return NextResponse.json(
      { error: "매니저 지원 목록을 불러오지 못했습니다." },
      { status: 500 }
    );
  }

  const managers = (data ?? []) as AdminManager[];
  const activeByManager = new Map<string, AdminManagerActiveBooking>();

  const { data: assignments, error: assignError } = await supabase
    .from("booking_assignments")
    .select(
      "manager_id, status, booking_id, bookings(id, booking_number, patient_name, hospital_name, appointment_date)"
    )
    .in("status", ["ASSIGNED", "IN_PROGRESS"])
    .order("assigned_at", { ascending: false });

  if (assignError) {
    console.warn("[admin/managers] assignments:", assignError.message);
  } else {
    for (const row of (assignments ?? []) as ActiveAssignRow[]) {
      if (activeByManager.has(row.manager_id)) continue;
      const b = bookingFromJoin(row.bookings);
      if (!b) continue;
      activeByManager.set(row.manager_id, {
        booking_id: b.id,
        booking_number: b.booking_number,
        patient_name: b.patient_name,
        hospital_name: b.hospital_name,
        appointment_date: b.appointment_date,
        assignment_status: row.status,
      });
    }
  }

  const items: AdminManager[] = managers.map((m) => ({
    ...m,
    active_booking: activeByManager.get(m.id) ?? null,
  }));

  return NextResponse.json({ items });
}
