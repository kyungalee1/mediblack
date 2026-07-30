import { NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { BookingInsert } from "@/lib/types";

function isValidPayload(body: unknown): body is BookingInsert {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.applicant_name === "string" &&
    typeof b.applicant_phone === "string" &&
    typeof b.relationship === "string" &&
    typeof b.patient_name === "string" &&
    typeof b.hospital_name === "string" &&
    typeof b.appointment_date === "string" &&
    typeof b.selected_plan === "string" &&
    typeof b.price === "number"
  );
}

export async function POST(request: Request) {
  try {
    if (!isSupabaseConfigured()) {
      // Dev fallback when env is not set — still returns a mock id
      const mockId = crypto.randomUUID();
      console.warn(
        "[bookings] Supabase env missing — returning mock booking id:",
        mockId
      );
      return NextResponse.json({ id: mockId, mock: true });
    }

    const body = await request.json();
    if (!isValidPayload(body)) {
      return NextResponse.json(
        { error: "필수 항목이 누락되었습니다." },
        { status: 400 }
      );
    }

    const payload: BookingInsert = {
      applicant_name: body.applicant_name,
      applicant_phone: body.applicant_phone,
      relationship: body.relationship,
      patient_name: body.patient_name,
      patient_gender: body.patient_gender ?? null,
      patient_age: body.patient_age ?? null,
      patient_phone: body.patient_phone ?? null,
      hospital_name: body.hospital_name,
      department: body.department ?? null,
      appointment_date: body.appointment_date,
      appointment_time: body.appointment_time ?? null,
      medical_condition: body.medical_condition ?? null,
      special_requests: body.special_requests ?? null,
      selected_plan: body.selected_plan,
      price: body.price,
      status: body.status || "PENDING",
    };

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("bookings")
      .insert(payload)
      .select("id")
      .single();

    if (error) {
      console.error("[bookings] insert error:", error);
      return NextResponse.json(
        { error: "접수 저장에 실패했습니다. 잠시 후 다시 시도해 주세요." },
        { status: 500 }
      );
    }

    return NextResponse.json({ id: data.id });
  } catch (err) {
    console.error("[bookings] unexpected:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
