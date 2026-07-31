import type { Metadata } from "next";
import { ManagerApplyPage } from "@/components/manager/ManagerApplyPage";

export const metadata: Metadata = {
  title: "동행 Manager 지원 | MediBlack",
  description:
    "MediBlack 프리미엄 병원 동행 매니저 지원. 자격·경력을 등록하고 전문 동행 파트너로 합류하세요.",
};

export const dynamic = "force-dynamic";
export const revalidate = 0;

/** Alias of /manager — use if /manager is still CDN-cached as 404 */
export default function PartnerRoutePage() {
  return <ManagerApplyPage />;
}
