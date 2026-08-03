"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  ClipboardList,
  HeartHandshake,
  LayoutDashboard,
  LogOut,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const NAV = [
  { href: "/admin/dashboard", label: "대시보드", icon: LayoutDashboard },
  { href: "/admin/bookings", label: "보호자 접수", icon: ClipboardList },
  { href: "/admin/managers", label: "동행 Manager", icon: HeartHandshake },
];

export function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();

  const logout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin");
    router.refresh();
  };

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-6xl flex-col md:flex-row">
      <aside className="border-b border-slate-200 bg-navy text-white md:w-56 md:border-b-0 md:border-r md:border-slate-800">
        <div className="px-5 py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gold">
            MediBlack
          </p>
          <p className="mt-1 text-lg font-extrabold">Ops Dashboard</p>
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-3 md:flex-col md:pb-6">
          {NAV.map(({ href, label, icon: Icon }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold transition-colors",
                  active
                    ? "bg-white/15 text-white"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            );
          })}
        </nav>
        <div className="hidden px-3 pb-5 md:block">
          <Button
            type="button"
            variant="secondary"
            size="sm"
            className="w-full"
            onClick={logout}
          >
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-slate-200 bg-white px-5 py-3 md:hidden">
          <p className="text-sm font-bold">관리자</p>
          <Button type="button" variant="ghost" size="sm" onClick={logout}>
            <LogOut className="h-4 w-4" />
            로그아웃
          </Button>
        </header>
        <main className="flex-1 px-4 py-6 sm:px-6">{children}</main>
      </div>
    </div>
  );
}
