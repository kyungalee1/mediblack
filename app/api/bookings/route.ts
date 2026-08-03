import { NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { BookingInsert } from "@/lib/types";
import { generateBookingNumber } from "@/lib/utils";

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
    const body = await request.json();
    if (!isValidPayload(body)) {
      return NextResponse.json(
        { error: "필수 항목이 누락되었습니다." },
        { status: 400 }
      );
    }

    const bookingNumber =
      typeof body.booking_number === "string" && body.booking_number.trim()
        ? body.booking_number.trim()
        : generateBookingNumber();

    if (!isSupabaseConfigured()) {
      console.warn(
        "[bookings] Supabase env missing — mock booking:",
        bookingNumber
      );
      return NextResponse.json({
        id: crypto.randomUUID(),
        booking_number: bookingNumber,
        mock: true,
      });
    }

    const payload: BookingInsert = {
      booking_number: bookingNumber,
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
      transport_method: body.transport_method ?? null,
      special_requests: body.special_requests ?? null,
      doctor_questions: body.doctor_questions ?? null,
      selected_plan: body.selected_plan,
      price: body.price,
      status: body.status || "PENDING",
    };

    const supabase = getSupabase();
    let { data, error } = await supabase
      .from("bookings")
      .insert(payload)
      .select("id, booking_number")
      .single();

    // transport_method 컬럼이 아직 없으면 마이그레이션 전 호환 저장
    if (
      error &&
      (error.message?.includes("transport_method") || error.code === "PGRST204")
    ) {
      const { transport_method, ...legacy } = payload;
      const note = transport_method
        ? `[이동수단] ${transport_method}`
        : null;
      const mergedRequests = [legacy.special_requests, note]
        .filter(Boolean)
        .join("\n");
      const retry = await supabase
        .from("bookings")
        .insert({
          ...legacy,
          special_requests: mergedRequests || null,
        })
        .select("id, booking_number")
        .single();
      data = retry.data;
      error = retry.error;
    }

    if (error || !data) {
      console.error("[bookings] insert error:", error);
      const duplicate =
        error?.code === "23505" ||
        error?.message?.toLowerCase().includes("duplicate");
      return NextResponse.json(
        {
          error: duplicate
            ? "예약번호가 중복되었습니다. 새로고침 후 다시 시도해 주세요."
            : "접수 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: data.id,
      booking_number: data.booking_number,
    });
  } catch (err) {
    console.error("[bookings] unexpected:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
