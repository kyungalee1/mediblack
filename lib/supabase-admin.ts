import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSupabaseConfigured } from "@/lib/supabase";

let adminClient: SupabaseClient | null = null;

/** Prefer service role for status updates; falls back to anon if unset. */
export function getSupabaseAdmin(): SupabaseClient {
  if (adminClient) return adminClient;

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const key = serviceKey || anonKey;

  if (!url || !key) {
    throw new Error("Supabase env missing for admin client");
  }

  adminClient = createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  return adminClient;
}

export function isAdminDbConfigured(): boolean {
  return isSupabaseConfigured();
}

export function usingServiceRole(): boolean {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);
}
