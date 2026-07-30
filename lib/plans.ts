import type { PlanId } from "./types";

export interface Plan {
  id: PlanId;
  name: string;
  subtitle: string;
  hours: number;
  price: number;
  badge?: string;
  features: string[];
}

export const PLANS: Plan[] = [
  {
    id: "standard",
    name: "Standard VIP",
    subtitle: "기본 VIP 동행",
    hours: 3,
    price: 60000,
    features: [
      "1:1 전문 동행 3시간",
      "병원 접수·안내 지원",
      "의사 소통 내용 정리",
      "당일 문자 리포트",
    ],
  },
  {
    id: "deep",
    name: "Deep Care VIP",
    subtitle: "심층 케어",
    hours: 5,
    price: 100000,
    badge: "인기",
    features: [
      "1:1 전문 동행 5시간",
      "의사 소통 정리 및 질문 대행",
      "검사·처치 동행 지원",
      "VIP 진료 리포트 발송",
      "사후 상담 1회 포함",
    ],
  },
  {
    id: "full",
    name: "Full Day VIP",
    subtitle: "하루 종일 케어",
    hours: 8,
    price: 150000,
    badge: "프리미엄",
    features: [
      "1:1 전문 동행 8시간",
      "전 일정 밀착 케어",
      "의사 소통·기록 전담",
      "상세 VIP 진료 리포트",
      "사후 상담 2회 + 케어 플랜",
    ],
  },
];

export function getPlanById(id: PlanId | ""): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
