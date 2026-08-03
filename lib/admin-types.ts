export type BookingStatus =
  | "PENDING"
  | "CONFIRMED"
  | "ASSIGNED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED";

export type ManagerStatus =
  | "PENDING"
  | "REVIEWING"
  | "APPROVED"
  | "REJECTED"
  | "INACTIVE";

export const BOOKING_STATUSES: BookingStatus[] = [
  "PENDING",
  "CONFIRMED",
  "ASSIGNED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export const MANAGER_STATUSES: ManagerStatus[] = [
  "PENDING",
  "REVIEWING",
  "APPROVED",
  "REJECTED",
  "INACTIVE",
];

export const BOOKING_STATUS_LABEL: Record<BookingStatus, string> = {
  PENDING: "접수 대기",
  CONFIRMED: "예약 확정",
  ASSIGNED: "매니저 배정",
  IN_PROGRESS: "동행 중",
  COMPLETED: "완료",
  CANCELLED: "취소",
};

export const MANAGER_STATUS_LABEL: Record<ManagerStatus, string> = {
  PENDING: "지원 접수",
  REVIEWING: "심사 중",
  APPROVED: "승인",
  REJECTED: "반려",
  INACTIVE: "비활성",
};

export interface AdminBooking {
  id: string;
  created_at: string;
  booking_number: string;
  applicant_name: string;
  applicant_phone: string;
  relationship: string;
  patient_name: string;
  patient_gender: string | null;
  patient_age: string | null;
  patient_phone: string | null;
  hospital_name: string;
  department: string | null;
  appointment_date: string;
  appointment_time: string | null;
  medical_condition: string | null;
  special_requests: string | null;
  doctor_questions: string | null;
  selected_plan: string;
  price: number;
  status: string;
}

export interface AdminManager {
  id: string;
  created_at: string;
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
  status: string;
  notes: string | null;
}
