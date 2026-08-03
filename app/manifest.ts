import type { MetadataRoute } from "next";

/** 보호자 접수 앱 — 홈 화면 설치 시 MediBlack */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "MediBlack — 메디블랙",
    short_name: "MediBlack",
    description: "프리미엄 병원 동행 VIP 서비스 빠른 접수",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#F4F6F9",
    theme_color: "#0F172A",
    orientation: "portrait-primary",
    lang: "ko",
    categories: ["health", "medical", "lifestyle"],
    icons: [
      {
        src: "/icons/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/icons/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
