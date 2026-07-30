export type Relationship = "자녀" | "배우자" | "본인" | "기타";
export type PatientGender = "남성" | "여성" | "기타";
export type PlanId = "standard" | "deep" | "full";

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
