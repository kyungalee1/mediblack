import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "동행 Manager — MediBlack",
    short_name: "동행 Manager",
    description: "MediBlack 프리미엄 병원 동행 매니저 지원 앱",
    start_url: "/",
    display: "standalone",
    background_color: "#F4F6F9",
    theme_color: "#0F172A",
    orientation: "portrait-primary",
    lang: "ko",
    categories: ["health", "medical", "business"],
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
