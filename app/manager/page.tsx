import { ManagerApplyPage } from "@/components/manager/ManagerApplyPage";

/** Bust any stale CDN 404 cached before this route existed */
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function ManagerRoutePage() {
  return <ManagerApplyPage />;
}
