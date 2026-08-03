import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { BOOKING_STATUSES, type BookingStatus } from "@/lib/admin-types";
import {
  getSupabaseAdmin,
  isAdminDbConfigured,
} from "@/lib/supabase-admin";

export async function PATCH(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  const denied = await requireAdmin();
  if (denied) return denied;

  const { id } = await context.params;
  const body = await request.json().catch(() => null);
  const status = body?.status as string | undefined;

  if (!status || !BOOKING_STATUSES.includes(status as BookingStatus)) {
    return NextResponse.json(
      { error: "유효하지 않은 상태입니다." },
      { status: 400 }
    );
  }

  if (!isAdminDbConfigured()) {
    return NextResponse.json({ id, status, mock: true });
  }

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("bookings")
    .update({ status })
    .eq("id", id)
    .select("id, status")
    .single();

  if (error) {
    console.error("[admin/bookings/patch]", error);
    return NextResponse.json(
      {
        error:
          "상태 변경 실패. migration_admin_update.sql 실행 또는 SERVICE_ROLE 키를 확인하세요.",
      },
      { status: 500 }
    );
  }

  return NextResponse.json(data);
}
