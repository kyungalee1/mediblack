import type { Metadata, Viewport } from "next";
import { Noto_Sans_KR } from "next/font/google";
import "./globals.css";

const notoSansKr = Noto_Sans_KR({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-pretendard",
  display: "swap",
});

export const metadata: Metadata = {
  title: "동행 Manager | MediBlack",
  description:
    "MediBlack 프리미엄 병원 동행 매니저 지원. 자격·경력을 등록하고 전문 동행 파트너로 합류하세요.",
  applicationName: "동행 Manager",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "동행 Manager",
  },
  formatDetection: {
    telephone: true,
  },
  icons: {
    icon: [
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#0F172A",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} h-full antialiased`}>
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/variable/pretendardvariable-dynamic-subset.min.css"
        />
      </head>
      <body className="app-shell min-h-full font-sans">{children}</body>
    </html>
  );
}
