"use client";

import { useEffect, useState } from "react";
import { Download, Share, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt({ className }: { className?: string }) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window);
    setIsIOS(ios);

    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      ("standalone" in navigator &&
        (navigator as Navigator & { standalone?: boolean }).standalone ===
          true);
    if (standalone) setInstalled(true);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (installed) return null;

  const onInstall = async () => {
    if (deferred) {
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
        setDeferred(null);
      }
      return;
    }
    if (isIOS) {
      setShowIOSHint(true);
    }
  };

  return (
    <div
      className={cn(
        "overflow-hidden rounded-3xl border-2 border-teal/30 bg-gradient-to-br from-[#E8F5F3] to-white p-5",
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy text-gold">
          <Smartphone className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-navy">홈 화면에 추가하기</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            배정 알림·리포트 작성에 바로 접근할 수 있습니다.
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant="gold"
        className="mt-4 w-full"
        onClick={onInstall}
      >
        <Download className="h-5 w-5" />
        {isIOS && !deferred ? "설치 방법 보기" : "홈 화면에 추가"}
      </Button>

      {showIOSHint && (
        <div className="mt-3 rounded-2xl bg-white/80 p-3 text-sm text-slate-600">
          <p className="flex items-center gap-1.5 font-semibold text-navy">
            <Share className="h-4 w-4" />
            Safari 설치 안내
          </p>
          <ol className="mt-2 list-decimal space-y-1 pl-5">
            <li>하단 공유 버튼을 탭하세요</li>
            <li>
              <strong>홈 화면에 추가</strong>를 선택하세요
            </li>
            <li>추가를 누르면 완료됩니다</li>
          </ol>
        </div>
      )}
    </div>
  );
}
