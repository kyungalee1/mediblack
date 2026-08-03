import type { Metadata, Viewport } from "next";
import { managerPwaMetadata } from "@/lib/manager-pwa";

export const metadata: Metadata = managerPwaMetadata;

export const viewport: Viewport = {
  themeColor: "#0F766E",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function PartnerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
