export type ManagerGender = "남성" | "여성" | "기타";

export type Certification =
  | "요양보호사"
  | "간호조무사"
  | "간호사"
  | "사회복지사"
  | "응급구조사"
  | "의료통역사"
  | "기타";

export type SpecialtyArea =
  | "내과/만성질환"
  | "외과/수술 동행"
  | "암센터"
  | "재활/이동보조"
  | "소아/청소년"
  | "노인케어"
  | "응급/응급실"
  | "기타";

export type AvailableDay =
  | "월"
  | "화"
  | "수"
  | "목"
  | "금"
  | "토"
  | "일";

export type Language = "한국어" | "영어" | "중국어" | "일본어" | "기타";

export type ExperienceYears =
  | "경력 없음"
  | "1년 미만"
  | "1–3년"
  | "3–5년"
  | "5년 이상";

export interface ManagerFormData {
  applicationNumber: string;
  fullName: string;
  phone: string;
  email: string;
  birthYear: string;
  gender: ManagerGender | "";
  region: string;
  certifications: Certification[];
  otherCertification: string;
  experienceYears: ExperienceYears | "";
  specialtyAreas: SpecialtyArea[];
  languages: Language[];
  availableDays: AvailableDay[];
  preferredHospitals: string;
  intro: string;
  motivation: string;
  agreePrivacy: boolean;
  agreeTerms: boolean;
}

export interface ManagerInsert {
  application_number: string;
  full_name: string;
  phone: string;
  email: string | null;
  birth_year: string | null;
  gender: string | null;
  region: string;
  certifications: string[];
  other_certification: string | null;
  experience_years: string | null;
  specialty_areas: string[];
  languages: string[];
  available_days: string[];
  preferred_hospitals: string | null;
  intro: string | null;
  motivation: string | null;
  agree_privacy: boolean;
  agree_terms: boolean;
  status: string;
}

export interface CertificationMeta {
  id: Certification;
  description: string;
}

export function createInitialManagerFormData(
  applicationNumber: string
): ManagerFormData {
  return {
    applicationNumber,
    fullName: "",
    phone: "",
    email: "",
    birthYear: "",
    gender: "",
    region: "",
    certifications: [],
    otherCertification: "",
    experienceYears: "",
    specialtyAreas: [],
    languages: ["한국어"],
    availableDays: [],
    preferredHospitals: "",
    intro: "",
    motivation: "",
    agreePrivacy: false,
    agreeTerms: false,
  };
}

export const MANAGER_GENDER_OPTIONS: ManagerGender[] = [
  "남성",
  "여성",
  "기타",
];

export const CERTIFICATION_META: CertificationMeta[] = [
  { id: "요양보호사", description: "노인·환자 일상 케어 및 이동 보조" },
  { id: "간호조무사", description: "병원 현장 보조·기본 간호 지원" },
  { id: "간호사", description: "전문 간호·의료진 커뮤니케이션" },
  { id: "사회복지사", description: "보호자 상담·복지 연계" },
  { id: "응급구조사", description: "응급 상황 대응·이송 지원" },
  { id: "의료통역사", description: "외국인 환자·보호자 통역" },
  { id: "기타", description: "관련 자격·교육을 직접 입력" },
];

export const SPECIALTY_OPTIONS: SpecialtyArea[] = [
  "내과/만성질환",
  "외과/수술 동행",
  "암센터",
  "재활/이동보조",
  "소아/청소년",
  "노인케어",
  "응급/응급실",
  "기타",
];

export const DAY_OPTIONS: AvailableDay[] = [
  "월",
  "화",
  "수",
  "목",
  "금",
  "토",
  "일",
];

export const LANGUAGE_OPTIONS: Language[] = [
  "한국어",
  "영어",
  "중국어",
  "일본어",
  "기타",
];

export const EXPERIENCE_OPTIONS: ExperienceYears[] = [
  "경력 없음",
  "1년 미만",
  "1–3년",
  "3–5년",
  "5년 이상",
];

export const REGION_SUGGESTIONS = [
  "서울 강남/서초",
  "서울 강북/노원",
  "서울 종로/중구",
  "서울 영등포/여의도",
  "경기 분당/판교",
  "경기 일산",
  "인천",
  "기타",
];
