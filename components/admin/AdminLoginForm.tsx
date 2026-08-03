"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AdminLoginForm() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "로그인 실패");
      router.replace("/admin/dashboard");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "로그인 실패");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="mt-6 space-y-4">
      <div>
        <Label htmlFor="admin-password">관리자 비밀번호</Label>
        <Input
          id="admin-password"
          type="password"
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="ADMIN_PASSWORD"
          required
        />
      </div>
      {error && (
        <p className="rounded-2xl bg-red-50 px-3 py-2 text-sm text-red-700" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" className="w-full" disabled={loading}>
        {loading ? (
          <Loader2 className="h-5 w-5 animate-spin" />
        ) : (
          <Lock className="h-5 w-5" />
        )}
        로그인
      </Button>
    </form>
  );
}
