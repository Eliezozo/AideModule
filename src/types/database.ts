// src/types/database.ts
// Types métier MVP — à synchroniser avec supabase gen types après connexion projet

export type AccountStatus = "pending" | "active" | "suspended";
export type AppRole = "student" | "admin";
export type TutorStatus = "pending" | "approved" | "rejected" | "suspended";
export type AssistanceMode = "online" | "in_person";

export type RequestStatus =
  | "open"
  | "matched"
  | "closed"
  | "cancelled"
  | "expired";

export type ProposalStatus =
  | "pending"
  | "accepted"
  | "rejected"
  | "expired"
  | "withdrawn";

export type BookingStatus =
  | "pending_payment"
  | "confirmed"
  | "in_progress"
  | "awaiting_completion"
  | "completed"
  | "disputed"
  | "cancelled"
  | "refunded";

export type PaymentStatus =
  | "pending"
  | "paid"
  | "failed"
  | "refunded"
  | "partially_refunded";

export type WithdrawalStatus =
  | "pending"
  | "processing"
  | "paid"
  | "failed"
  | "cancelled";

export interface Profile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  student_number: string | null;
  faculty_id: string | null;
  level_id: string | null;
  avatar_url: string | null;
  account_status: AccountStatus;
  created_at: string;
  updated_at: string;
}

export interface Faculty {
  id: string;
  name: string;
  code: string;
  is_active: boolean;
}

export interface Level {
  id: string;
  name: string;
  sort_order: number;
  is_active: boolean;
}

export interface AcademicModule {
  id: string;
  faculty_id: string;
  level_id: string;
  name: string;
  code: string | null;
  description: string | null;
  is_active: boolean;
}

export interface HelpRequest {
  id: string;
  requester_id: string;
  faculty_id: string;
  level_id: string;
  module_id: string;
  module_name_snapshot: string;
  description: string;
  preferred_mode: AssistanceMode;
  preferred_date: string | null;
  preferred_duration_minutes: number;
  budget_amount: number | null;
  status: RequestStatus;
  created_at: string;
}

export interface Proposal {
  id: string;
  request_id: string;
  tutor_id: string;
  proposed_mode: AssistanceMode;
  hourly_rate: number;
  duration_minutes: number;
  proposed_date: string | null;
  message: string | null;
  status: ProposalStatus;
  expires_at: string | null;
  created_at: string;
}

export interface Booking {
  id: string;
  request_id: string;
  proposal_id: string;
  requester_id: string;
  tutor_id: string;
  mode: AssistanceMode;
  hourly_rate: number;
  duration_minutes: number;
  total_amount: number;
  currency: string;
  platform_commission_rate: number;
  platform_commission_amount: number;
  tutor_due_amount: number;
  scheduled_at: string;
  status: BookingStatus;
  completed_at: string | null;
}
