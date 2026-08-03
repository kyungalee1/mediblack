import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin-auth";
import {
  getSupabaseAdmin,
  isAdminDbConfigured,
} from "@/lib/supabase-admin";

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

  return NextResponse.json({ items: data ?? [] });
}
