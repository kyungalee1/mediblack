"use client";

import { useEffect, useState } from "react";
import { Download, MoreVertical, Share, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Variant = "booking" | "manager";

const COPY: Record<
  Variant,
  { title: string; body: string; border: string; bg: string; appName: string }
> = {
  booking: {
    title: "MediBlack 홈 화면에 추가",
    body: "보호자 접수 앱으로 설치됩니다. 동행 Manager와 따로 설치할 수 있습니다.",
    border: "border-gold/40",
    bg: "from-[#FFF9EB] to-white",
    appName: "MediBlack",
  },
  manager: {
    title: "동행 Manager 홈 화면에 추가",
    body: "브라우저 메뉴로 설치하세요. (같은 사이트에 앱이 이미 있으면 아래 버튼 대신 메뉴 설치가 필요합니다.)",
    border: "border-teal/30",
    bg: "from-[#E8F5F3] to-white",
    appName: "동행Manager",
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
  const [isAndroid, setIsAndroid] = useState(false);
  const [installed, setInstalled] = useState(false);
  const [showGuide, setShowGuide] = useState(variant === "manager");
  const [promptError, setPromptError] = useState("");
  const copy = COPY[variant];

  useEffect(() => {
    const ua = window.navigator.userAgent;
    const ios = /iPad|iPhone|iPod/.test(ua) && !("MSStream" in window);
    const android = /Android/i.test(ua);
    setIsIOS(ios);
    setIsAndroid(android);
    // 두 번째 앱은 beforeinstallprompt가 안 뜨는 경우가 많아 안내를 기본 표시
    if (ios || variant === "manager") setShowGuide(true);

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
  }, [variant]);

  if (installed) return null;

  const onInstall = async () => {
    setPromptError("");
    setShowGuide(true);

    if (deferred) {
      try {
        await deferred.prompt();
        const choice = await deferred.userChoice;
        if (choice.outcome === "accepted") {
          setInstalled(true);
          setDeferred(null);
        }
      } catch {
        setPromptError(
          "자동 설치 창을 열 수 없습니다. 아래 브라우저 메뉴로 추가해 주세요."
        );
      }
      return;
    }

    // deferred 없음 = 버튼만으로는 설치 불가 → 안내 표시 (이전엔 Android에서 무반응)
    setPromptError(
      "이 브라우저에서는 자동 설치 버튼이 제한됩니다. 아래 순서대로 홈 화면에 추가해 주세요."
    );
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
        {deferred ? "홈 화면에 추가" : "설치 방법 보기"}
      </Button>

      {promptError && (
        <p className="mt-3 rounded-2xl bg-amber-50 px-3 py-2 text-sm text-amber-900">
          {promptError}
        </p>
      )}

      {showGuide && (
        <div className="mt-3 rounded-2xl bg-white/80 p-3 text-sm text-slate-600">
          {isIOS ? (
            <>
              <p className="flex items-center gap-1.5 font-semibold text-navy">
                <Share className="h-4 w-4" />
                iPhone Safari
              </p>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5">
                <li>
                  주소가{" "}
                  <strong>
                    {variant === "manager" ? "…/manager" : "접수 홈(/)"}
                  </strong>{" "}
                  인지 확인
                </li>
                <li>
                  하단 <strong>공유</strong> 버튼 탭
                </li>
                <li>
                  <strong>홈 화면에 추가</strong> 선택
                </li>
                <li>
                  이름에 <strong>{copy.appName}</strong> 이 보이는지 확인 후 추가
                </li>
              </ol>
            </>
          ) : (
            <>
              <p className="flex items-center gap-1.5 font-semibold text-navy">
                <MoreVertical className="h-4 w-4" />
                {isAndroid ? "Android Chrome" : "Chrome / Edge"}
              </p>
              <ol className="mt-2 list-decimal space-y-1.5 pl-5">
                <li>
                  주소가{" "}
                  <strong>
                    {variant === "manager" ? "…/manager" : "접수 홈(/)"}
                  </strong>{" "}
                  인지 확인 (이미 설치된 앱 창이 아니라 <strong>브라우저 탭</strong>)
                </li>
                <li>
                  오른쪽 위 <strong>⋮</strong> 메뉴
                </li>
                <li>
                  <strong>앱 설치</strong> 또는 <strong>홈 화면에 추가</strong> /
                  <strong> 바로가기 만들기</strong>
                </li>
                <li>
                  이름에 <strong>{copy.appName}</strong> 이 보이면 추가
                </li>
              </ol>
              {variant === "manager" && (
                <p className="mt-2 text-xs leading-relaxed text-slate-500">
                  ※ MediBlack을 이미 설치한 뒤라면, Chrome이 자동 설치 창을 안
                  띄우는 경우가 많습니다. 반드시 ⋮ 메뉴로 추가하세요.
                </p>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
