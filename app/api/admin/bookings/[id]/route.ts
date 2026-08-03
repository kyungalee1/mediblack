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
  const managerId =
    typeof body?.manager_id === "string" ? body.manager_id : undefined;

  if (status && !BOOKING_STATUSES.includes(status as BookingStatus)) {
    return NextResponse.json(
      { error: "유효하지 않은 상태입니다." },
      { status: 400 }
    );
  }

  if (!status && !managerId) {
    return NextResponse.json(
      { error: "변경할 항목이 없습니다." },
      { status: 400 }
    );
  }

  if (!isAdminDbConfigured()) {
    return NextResponse.json({
      id,
      status: status ?? "ASSIGNED",
      manager_id: managerId ?? null,
      mock: true,
    });
  }

  const supabase = getSupabaseAdmin();
  let nextStatus = status;

  // 매니저 배정
  if (managerId) {
    // 기존 활성 배정 종료
    await supabase
      .from("booking_assignments")
      .update({ status: "CANCELLED" })
      .eq("booking_id", id)
      .in("status", ["ASSIGNED", "IN_PROGRESS"]);

    const { error: assignError } = await supabase
      .from("booking_assignments")
      .upsert(
        {
          booking_id: id,
          manager_id: managerId,
          status: "ASSIGNED",
          assigned_at: new Date().toISOString(),
        },
        { onConflict: "booking_id,manager_id" }
      );

    if (assignError) {
      console.error("[admin/bookings/assign]", assignError);
      return NextResponse.json(
        {
          error:
            "매니저 배정 실패. supabase/migration_transport_assign.sql 을 실행했는지 확인하세요.",
        },
        { status: 500 }
      );
    }

    // 배정 시 예약 상태를 ASSIGNED로 (명시적 status가 없을 때)
    if (!nextStatus) nextStatus = "ASSIGNED";

    // 매니저를 동행중으로 바꾸진 않음 — 배정만. 동행중은 별도 상태 버튼.
  }

  if (nextStatus) {
    // 동행 중으로 바꾸면 활성 배정/매니저도 맞춤
    if (nextStatus === "IN_PROGRESS") {
      const { data: active } = await supabase
        .from("booking_assignments")
        .select("id, manager_id")
        .eq("booking_id", id)
        .in("status", ["ASSIGNED", "IN_PROGRESS"])
        .order("assigned_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (active?.id) {
        await supabase
          .from("booking_assignments")
          .update({ status: "IN_PROGRESS" })
          .eq("id", active.id);
        if (active.manager_id) {
          await supabase
            .from("managers")
            .update({ status: "ACCOMPANYING" })
            .eq("id", active.manager_id);
        }
      }
    }

    if (nextStatus === "COMPLETED" || nextStatus === "CANCELLED") {
      const { data: active } = await supabase
        .from("booking_assignments")
        .select("id, manager_id")
        .eq("booking_id", id)
        .in("status", ["ASSIGNED", "IN_PROGRESS"])
        .order("assigned_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (active?.id) {
        await supabase
          .from("booking_assignments")
          .update({
            status: nextStatus === "COMPLETED" ? "COMPLETED" : "CANCELLED",
          })
          .eq("id", active.id);
        if (active.manager_id) {
          await supabase
            .from("managers")
            .update({ status: "APPROVED" })
            .eq("id", active.manager_id)
            .eq("status", "ACCOMPANYING");
        }
      }
    }

    const { data, error } = await supabase
      .from("bookings")
      .update({ status: nextStatus })
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

    return NextResponse.json({ ...data, manager_id: managerId ?? null });
  }

  return NextResponse.json({ id, manager_id: managerId });
}
