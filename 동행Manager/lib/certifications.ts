import type { Certification } from "@/lib/types";

export interface CertificationMeta {
  id: Certification;
  description: string;
}

export const CERTIFICATION_META: CertificationMeta[] = [
  {
    id: "요양보호사",
    description: "노인·환자 일상 케어 및 이동 보조",
  },
  {
    id: "간호조무사",
    description: "병원 현장 보조·기본 간호 지원",
  },
  {
    id: "간호사",
    description: "전문 간호·의료진 커뮤니케이션",
  },
  {
    id: "사회복지사",
    description: "보호자 상담·복지 연계",
  },
  {
    id: "응급구조사",
    description: "응급 상황 대응·이송 지원",
  },
  {
    id: "의료통역사",
    description: "외국인 환자·보호자 통역",
  },
  {
    id: "기타",
    description: "관련 자격·교육을 직접 입력",
  },
];
