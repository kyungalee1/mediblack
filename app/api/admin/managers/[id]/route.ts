import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import { MANAGER_STATUSES, type ManagerStatus } from "@/lib/admin-types";
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
  const notes =
    typeof body?.notes === "string" ? body.notes : undefined;

  if (status && !MANAGER_STATUSES.includes(status as ManagerStatus)) {
    return NextResponse.json(
      { error: "유효하지 않은 상태입니다." },
      { status: 400 }
    );
  }

  if (!status && notes === undefined) {
    return NextResponse.json(
      { error: "변경할 항목이 없습니다." },
      { status: 400 }
    );
  }

  if (!isAdminDbConfigured()) {
    return NextResponse.json({ id, status, notes, mock: true });
  }

  const patch: Record<string, string> = {};
  if (status) patch.status = status;
  if (notes !== undefined) patch.notes = notes;

  const supabase = getSupabaseAdmin();
  const { data, error } = await supabase
    .from("managers")
    .update(patch)
    .eq("id", id)
    .select("id, status, notes")
    .single();

  if (error) {
    console.error("[admin/managers/patch]", error);
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
