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
    return NextResponse.json({
      bookingsTotal: 0,
      bookingsPending: 0,
      managersTotal: 0,
      managersPending: 0,
      mock: true,
    });
  }

  const supabase = getSupabaseAdmin();

  const [bookings, bookingsPending, managers, managersPending] =
    await Promise.all([
      supabase.from("bookings").select("id", { count: "exact", head: true }),
      supabase
        .from("bookings")
        .select("id", { count: "exact", head: true })
        .eq("status", "PENDING"),
      supabase.from("managers").select("id", { count: "exact", head: true }),
      supabase
        .from("managers")
        .select("id", { count: "exact", head: true })
        .eq("status", "PENDING"),
    ]);

  return NextResponse.json({
    bookingsTotal: bookings.count ?? 0,
    bookingsPending: bookingsPending.count ?? 0,
    managersTotal: managers.count ?? 0,
    managersPending: managersPending.count ?? 0,
  });
}
