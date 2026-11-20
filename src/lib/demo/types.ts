// src/lib/demo/types.ts
import type {
  AccountStatus,
  AppRole,
  AssistanceMode,
  BookingStatus,
  PaymentStatus,
  ProposalStatus,
  RequestStatus,
  TutorStatus,
  WithdrawalStatus,
} from "@/types/database";

export type DemoSession = {
  userId: string;
  role: AppRole;
};

export type DemoUser = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string | null;
  studentNumber: string | null;
  facultyId: string | null;
  levelId: string | null;
  accountStatus: AccountStatus;
  role: AppRole;
  password: string;
};

export type DemoTutorProfile = {
  id: string;
  userId: string;
  status: TutorStatus;
  payoutPhone: string | null;
  payoutProvider: string | null;
  bio: string | null;
  approvedAt: string | null;
};

export type DemoFaculty = {
  id: string;
  name: string;
  code: string;
  isActive: boolean;
};

export type DemoLevel = {
  id: string;
  name: string;
  sortOrder: number;
  isActive: boolean;
};

export type DemoModule = {
  id: string;
  facultyId: string;
  levelId: string;
  name: string;
  code: string | null;
  description: string | null;
  isActive: boolean;
};

export type DemoRequest = {
  id: string;
  requesterId: string;
  facultyId: string;
  levelId: string;
  moduleId: string;
  moduleNameSnapshot: string;
  description: string;
  preferredMode: AssistanceMode;
  preferredDate: string | null;
  preferredDurationMinutes: number;
  budgetAmount: number | null;
  status: RequestStatus;
  createdAt: string;
  expiresAt: string | null;
};

export type DemoProposal = {
  id: string;
  requestId: string;
  tutorId: string;
  proposedMode: AssistanceMode;
  hourlyRate: number;
  durationMinutes: number;
  proposedDate: string | null;
  message: string | null;
  status: ProposalStatus;
  expiresAt: string | null;
  createdAt: string;
};

export type DemoBooking = {
  id: string;
  requestId: string;
  proposalId: string;
  requesterId: string;
  tutorId: string;
  mode: AssistanceMode;
  hourlyRate: number;
  durationMinutes: number;
  totalAmount: number;
  currency: "XOF";
  platformCommissionRate: number;
  platformCommissionAmount: number;
  tutorDueAmount: number;
  scheduledAt: string;
  status: BookingStatus;
  requesterConfirmedAt: string | null;
  tutorConfirmedAt: string | null;
  completedAt: string | null;
  createdAt: string;
};

export type DemoPayment = {
  id: string;
  bookingId: string;
  provider: string;
  providerReference: string | null;
  amount: number;
  currency: "XOF";
  status: PaymentStatus;
  paidAt: string | null;
  createdAt: string;
};

export type DemoWallet = {
  tutorId: string;
  pendingBalance: number;
  availableBalance: number;
  totalEarned: number;
  totalPaidOut: number;
};

export type DemoNotification = {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: string;
  relatedEntityType: string | null;
  relatedEntityId: string | null;
  readAt: string | null;
  createdAt: string;
};

export type DemoWithdrawal = {
  id: string;
  tutorId: string;
  amount: number;
  status: WithdrawalStatus;
  payoutPhoneSnapshot: string | null;
  providerReference: string | null;
  createdAt: string;
  processedAt: string | null;
};

export type DemoStore = {
  users: DemoUser[];
  tutorProfiles: DemoTutorProfile[];
  faculties: DemoFaculty[];
  levels: DemoLevel[];
  modules: DemoModule[];
  requests: DemoRequest[];
  proposals: DemoProposal[];
  bookings: DemoBooking[];
  payments: DemoPayment[];
  wallets: DemoWallet[];
  notifications: DemoNotification[];
  withdrawals: DemoWithdrawal[];
};
