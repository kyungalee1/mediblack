import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

export const ADMIN_COOKIE = "mb_admin_session";

function getAdminPassword(): string | null {
  const pw = process.env.ADMIN_PASSWORD?.trim();
  return pw || null;
}

export function isAdminConfigured(): boolean {
  return Boolean(getAdminPassword());
}

export function makeAdminToken(password: string): string {
  return createHash("sha256")
    .update(`mediblack-admin-v1:${password}`)
    .digest("hex");
}

export function verifyAdminPassword(password: string): boolean {
  const expected = getAdminPassword();
  if (!expected) return false;
  const a = Buffer.from(makeAdminToken(password));
  const b = Buffer.from(makeAdminToken(expected));
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const expectedPw = getAdminPassword();
  if (!expectedPw) return false;
  const jar = await cookies();
  const token = jar.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const expected = makeAdminToken(expectedPw);
  try {
    const a = Buffer.from(token);
    const b = Buffer.from(expected);
    if (a.length !== b.length) return false;
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function requireAdmin(): Promise<Response | null> {
  if (!isAdminConfigured()) {
    return Response.json(
      { error: "ADMIN_PASSWORD 환경변수가 설정되지 않았습니다." },
      { status: 503 }
    );
  }
  if (!(await isAdminAuthenticated())) {
    return Response.json({ error: "로그인이 필요합니다." }, { status: 401 });
  }
  return null;
}
