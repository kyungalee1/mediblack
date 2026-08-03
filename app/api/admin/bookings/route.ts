import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import type { AdminBooking } from "@/lib/admin-types";
import {
  getSupabaseAdmin,
  isAdminDbConfigured,
} from "@/lib/supabase-admin";

type AssignmentRow = {
  id: string;
  booking_id: string;
  manager_id: string;
  status: string;
  assigned_at: string;
  managers:
    | { full_name: string; phone: string }
    | { full_name: string; phone: string }[]
    | null;
};

function managerFromJoin(
  managers: AssignmentRow["managers"]
): { full_name: string; phone: string } | null {
  if (!managers) return null;
  return Array.isArray(managers) ? managers[0] ?? null : managers;
}

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;

  if (!isAdminDbConfigured()) {
    return NextResponse.json({ items: [], mock: true });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(200);

  if (error) {
    console.error("[admin/bookings]", error);
    return NextResponse.json(
      { error: "접수 목록을 불러오지 못했습니다." },
      { status: 500 }
    );
  }

  const bookings = (data ?? []) as AdminBooking[];
  const bookingIds = bookings.map((b) => b.id);

  const assignmentByBooking = new Map<
    string,
    {
      assignment_id: string;
      assigned_manager_id: string;
      assigned_manager_name: string | null;
      assigned_manager_phone: string | null;
      assignment_status: string;
    }
  >();

  if (bookingIds.length > 0) {
    const { data: assignments, error: assignError } = await supabase
      .from("booking_assignments")
      .select(
        "id, booking_id, manager_id, status, assigned_at, managers(full_name, phone)"
      )
      .in("booking_id", bookingIds)
      .in("status", ["ASSIGNED", "IN_PROGRESS"])
      .order("assigned_at", { ascending: false });

    if (assignError) {
      // 테이블 미생성 시에도 접수 목록은 보여 줌
      console.warn("[admin/bookings] assignments:", assignError.message);
    } else {
      for (const row of (assignments ?? []) as AssignmentRow[]) {
        if (assignmentByBooking.has(row.booking_id)) continue;
        const mgr = managerFromJoin(row.managers);
        assignmentByBooking.set(row.booking_id, {
          assignment_id: row.id,
          assigned_manager_id: row.manager_id,
          assigned_manager_name: mgr?.full_name ?? null,
          assigned_manager_phone: mgr?.phone ?? null,
          assignment_status: row.status,
        });
      }
    }
  }

  const items: AdminBooking[] = bookings.map((b) => {
    const a = assignmentByBooking.get(b.id);
    return {
      ...b,
      assigned_manager_id: a?.assigned_manager_id ?? null,
      assigned_manager_name: a?.assigned_manager_name ?? null,
      assigned_manager_phone: a?.assigned_manager_phone ?? null,
      assignment_id: a?.assignment_id ?? null,
      assignment_status: a?.assignment_status ?? null,
    };
  });

  return NextResponse.json({ items });
}
