"use client";

import { useEffect, useState } from "react";
import { Download, Share, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Variant = "booking" | "manager";

const COPY: Record<
  Variant,
  { title: string; body: string; border: string; bg: string }
> = {
  booking: {
    title: "MediBlack 홈 화면에 추가",
    body: "보호자 접수 앱으로 설치됩니다. 동행 Manager와 따로 설치할 수 있습니다.",
    border: "border-gold/40",
    bg: "from-[#FFF9EB] to-white",
  },
  manager: {
    title: "동행 Manager 홈 화면에 추가",
    body: "매니저 지원 앱으로 따로 설치됩니다. MediBlack 접수 앱과 아이콘·이름이 다릅니다.",
    border: "border-teal/30",
    bg: "from-[#E8F5F3] to-white",
  },
};

export function InstallPrompt({
  className,
  variant = "booking",
}: {
  className?: string;
  variant?: Variant;
}) {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(
    null
  );
  const [isIOS, setIsIOS] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const copy = COPY[variant];

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
        "overflow-hidden rounded-3xl border-2 bg-gradient-to-br p-5",
        copy.border,
        copy.bg,
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div
          className={cn(
            "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-navy",
            variant === "manager" ? "text-teal" : "text-gold"
          )}
        >
          <Smartphone className="h-6 w-6" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-navy">{copy.title}</p>
          <p className="mt-1 text-sm leading-relaxed text-slate-600">
            {copy.body}
          </p>
        </div>
      </div>

      <Button
        type="button"
        variant={variant === "manager" ? "primary" : "gold"}
        className={cn(
          "mt-4 w-full",
          variant === "manager" && "bg-teal hover:bg-teal/90"
        )}
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
            <li>
              반드시{" "}
              <strong>
                {variant === "manager" ? "/manager" : "접수 홈(/)"}
              </strong>{" "}
              화면에서 공유를 누르세요
            </li>
            <li>
              <strong>홈 화면에 추가</strong>를 선택하세요
            </li>
            <li>
              이름에{" "}
              <strong>
                {variant === "manager" ? "동행Manager" : "MediBlack"}
              </strong>
              이 보이는지 확인하세요
            </li>
          </ol>
        </div>
      )}
    </div>
  );
}
