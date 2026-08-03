import type { Metadata } from "next";

/** /manager · /partner 전용 — 접수 앱과 별도 홈 화면 설치 */
export const managerPwaMetadata: Metadata = {
  title: "동행 Manager | MediBlack",
  description:
    "MediBlack 프리미엄 병원 동행 매니저 지원. 자격·경력을 등록하고 전문 동행 파트너로 합류하세요.",
  applicationName: "동행 Manager",
  manifest: "/manifest-manager.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "동행Manager",
  },
  icons: {
    icon: [
      {
        url: "/icons/manager-icon-192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        url: "/icons/manager-icon-512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    apple: [
      { url: "/icons/manager-apple-touch-icon.png", sizes: "180x180" },
    ],
  },
};
