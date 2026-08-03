export type Relationship = "자녀" | "배우자" | "본인" | "기타";
export type PatientGender = "남성" | "여성" | "기타";
export type PlanId = "standard" | "deep" | "full";

/** 병원 이동수단 */
export type TransportMethod =
  | "택시"
  | "대중교통/자차"
  | "기타(택시비 보호자·환자 결제)";

export interface BookingFormData {
  bookingNumber: string;
  applicantName: string;
  applicantPhone: string;
  relationship: Relationship | "";
  patientName: string;
  patientGender: PatientGender | "";
  patientAge: string;
  patientPhone: string;
  hospitalName: string;
  department: string;
  appointmentDate: string;
  appointmentTime: string;
  medicalCondition: string;
  transportMethod: TransportMethod | "";
  specialRequests: string;
  doctorQuestions: string;
  selectedPlan: PlanId | "";
  agreePrivacy: boolean;
  agreeLiability: boolean;
}

export interface BookingInsert {
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
  transport_method: string | null;
  special_requests: string | null;
  doctor_questions: string | null;
  selected_plan: string;
  price: number;
  status: string;
}

export function createInitialFormData(bookingNumber: string): BookingFormData {
  return {
    bookingNumber,
    applicantName: "",
    applicantPhone: "",
    relationship: "",
    patientName: "",
    patientGender: "",
    patientAge: "",
    patientPhone: "",
    hospitalName: "",
    department: "",
    appointmentDate: "",
    appointmentTime: "",
    medicalCondition: "",
    transportMethod: "",
    specialRequests: "",
    doctorQuestions: "",
    selectedPlan: "",
    agreePrivacy: false,
    agreeLiability: false,
  };
}

export const RELATIONSHIP_OPTIONS: Relationship[] = [
  "자녀",
  "배우자",
  "본인",
  "기타",
];

export const GENDER_OPTIONS: PatientGender[] = ["남성", "여성", "기타"];

export const TRANSPORT_OPTIONS: TransportMethod[] = [
  "택시",
  "대중교통/자차",
  "기타(택시비 보호자·환자 결제)",
];

export const TRANSPORT_OPTION_HINT: Record<TransportMethod, string> = {
  택시: "동행 매니저와 택시로 이동합니다.",
  "대중교통/자차": "버스·지하철 또는 자차로 이동합니다.",
  "기타(택시비 보호자·환자 결제)":
    "택시 이용 시 보호자 또는 환자가 직접 결제합니다.",
};

export const HOSPITAL_SUGGESTIONS = [
  "서울아산병원",
  "삼성서울병원",
  "세브란스병원",
  "서울대병원",
  "서울성모병원",
  "분당서울대병원",
  "고려대학교안암병원",
  "기타",
];
