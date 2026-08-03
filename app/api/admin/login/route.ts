import { NextResponse } from "next/server";
import {
  ADMIN_COOKIE,
  isAdminConfigured,
  makeAdminToken,
  verifyAdminPassword,
} from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!isAdminConfigured()) {
    return NextResponse.json(
      {
        error:
          "ADMIN_PASSWORD 가 설정되지 않았습니다. .env.local / Vercel env에 추가하세요.",
      },
      { status: 503 }
    );
  }

  const body = await request.json().catch(() => null);
  const password =
    body && typeof body.password === "string" ? body.password : "";

  if (!verifyAdminPassword(password)) {
    return NextResponse.json(
      { error: "비밀번호가 올바르지 않습니다." },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set(ADMIN_COOKIE, makeAdminToken(password), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
