import { NextResponse } from "next/server";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";
import type { ManagerInsert } from "@/lib/types";
import { generateApplicationNumber } from "@/lib/utils";

function isValidPayload(body: unknown): body is ManagerInsert {
  if (!body || typeof body !== "object") return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.full_name === "string" &&
    typeof b.phone === "string" &&
    typeof b.region === "string" &&
    Array.isArray(b.certifications) &&
    b.certifications.length > 0 &&
    b.agree_privacy === true &&
    b.agree_terms === true
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

    const applicationNumber =
      typeof body.application_number === "string" &&
      body.application_number.trim()
        ? body.application_number.trim()
        : generateApplicationNumber();

    if (!isSupabaseConfigured()) {
      console.warn(
        "[managers] Supabase env missing — mock application:",
        applicationNumber
      );
      return NextResponse.json({
        id: crypto.randomUUID(),
        application_number: applicationNumber,
        mock: true,
      });
    }

    const payload: ManagerInsert = {
      application_number: applicationNumber,
      full_name: body.full_name,
      phone: body.phone,
      email: body.email ?? null,
      birth_year: body.birth_year ?? null,
      gender: body.gender ?? null,
      region: body.region,
      certifications: body.certifications,
      other_certification: body.other_certification ?? null,
      experience_years: body.experience_years ?? null,
      specialty_areas: Array.isArray(body.specialty_areas)
        ? body.specialty_areas
        : [],
      languages: Array.isArray(body.languages) ? body.languages : [],
      available_days: Array.isArray(body.available_days)
        ? body.available_days
        : [],
      preferred_hospitals: body.preferred_hospitals ?? null,
      intro: body.intro ?? null,
      motivation: body.motivation ?? null,
      agree_privacy: true,
      agree_terms: true,
      status: body.status || "PENDING",
    };

    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("managers")
      .insert(payload)
      .select("id, application_number")
      .single();

    if (error) {
      console.error("[managers] insert error:", error);
      const duplicate =
        error.code === "23505" ||
        error.message?.toLowerCase().includes("duplicate");
      return NextResponse.json(
        {
          error: duplicate
            ? "지원번호가 중복되었습니다. 새로고침 후 다시 시도해 주세요."
            : "지원 저장에 실패했습니다. 잠시 후 다시 시도해 주세요.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      id: data.id,
      application_number: data.application_number,
    });
  } catch (err) {
    console.error("[managers] unexpected:", err);
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다." },
      { status: 500 }
    );
  }
}
