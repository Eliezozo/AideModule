// src/lib/demo/business.ts
// Logique métier centrale (RG-*) — indépendante de Supabase / paiement réel

import { AppConfig } from "@/lib/config";
import {
  computeTotalAmount,
  splitBookingAmount,
} from "@/lib/finance/commission";
import { getStore, nowIso, uid } from "@/lib/demo/store";
import type {
  DemoBooking,
  DemoModule,
  DemoProposal,
  DemoRequest,
  DemoTutorProfile,
  DemoUser,
} from "@/lib/demo/types";
import type { AssistanceMode } from "@/types/database";

export class BusinessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "BusinessError";
  }
}

function pushNotification(
  userId: string,
  title: string,
  message: string,
  type: string,
  relatedEntityType?: string,
  relatedEntityId?: string
) {
  getStore().notifications.unshift({
    id: uid("notif"),
    userId,
    title,
    message,
    type,
    relatedEntityType: relatedEntityType ?? null,
    relatedEntityId: relatedEntityId ?? null,
    readAt: null,
    createdAt: nowIso(),
  });
}

export function getApprovedTutorByUserId(userId: string) {
  return getStore().tutorProfiles.find(
    (t) => t.userId === userId && t.status === "approved"
  );
}

export function getTutorByUserId(userId: string) {
  return getStore().tutorProfiles.find((t) => t.userId === userId);
}

export function ensureModuleFromCatalog(moduleId: string): DemoModule {
  const module = getStore().modules.find((m) => m.id === moduleId && m.isActive);
  if (!module) {
    throw new BusinessError(
      "Le module doit être choisi dans le catalogue officiel."
    );
  }
  return module;
}

export function createHelpRequest(input: {
  requesterId: string;
  facultyId: string;
  levelId: string;
  moduleId: string;
  description: string;
  preferredMode: AssistanceMode;
  preferredDate?: string | null;
  preferredDurationMinutes: number;
  budgetAmount?: number | null;
}): DemoRequest {
  const module = ensureModuleFromCatalog(input.moduleId);

  if (module.facultyId !== input.facultyId || module.levelId !== input.levelId) {
    throw new BusinessError(
      "Le module ne correspond pas à la filière et au niveau sélectionnés."
    );
  }

  const request: DemoRequest = {
    id: uid("req"),
    requesterId: input.requesterId,
    facultyId: input.facultyId,
    levelId: input.levelId,
    moduleId: module.id,
    moduleNameSnapshot: module.name,
    description: input.description,
    preferredMode: input.preferredMode,
    preferredDate: input.preferredDate || null,
    preferredDurationMinutes: input.preferredDurationMinutes,
    budgetAmount: input.budgetAmount ?? null,
    status: "open",
    createdAt: nowIso(),
    expiresAt: null,
  };

  getStore().requests.unshift(request);

  const tutors = getStore().tutorProfiles.filter((t) => t.status === "approved");
  for (const tutor of tutors) {
    pushNotification(
      tutor.userId,
      "Nouvelle demande ouverte",
      `Une demande en ${module.name} est disponible.`,
      "new_request",
      "request",
      request.id
    );
  }

  return request;
}

export function createOrUpdateProposal(input: {
  tutorUserId: string;
  requestId: string;
  proposedMode: AssistanceMode;
  hourlyRate: number;
  durationMinutes: number;
  proposedDate?: string | null;
  message?: string | null;
}): DemoProposal {
  const tutor = getApprovedTutorByUserId(input.tutorUserId);
  if (!tutor) {
    throw new BusinessError(
      "Seul un aidant validé peut répondre aux demandes."
    );
  }

  const request = getStore().requests.find((r) => r.id === input.requestId);
  if (!request) throw new BusinessError("Demande introuvable.");
  if (request.status !== "open") {
    throw new BusinessError("Cette demande n'est plus ouverte.");
  }
  if (request.requesterId === input.tutorUserId) {
    throw new BusinessError("Tu ne peux pas répondre à ta propre demande.");
  }

  const existing = getStore().proposals.find(
    (p) =>
      p.requestId === input.requestId &&
      p.tutorId === tutor.id &&
      p.status === "pending"
  );

  if (existing) {
    existing.proposedMode = input.proposedMode;
    existing.hourlyRate = input.hourlyRate;
    existing.durationMinutes = input.durationMinutes;
    existing.proposedDate = input.proposedDate || null;
    existing.message = input.message || null;
    pushNotification(
      request.requesterId,
      "Proposition mise à jour",
      "Un aidant a mis à jour sa proposition.",
      "proposal_updated",
      "proposal",
      existing.id
    );
    return existing;
  }

  const proposal: DemoProposal = {
    id: uid("prop"),
    requestId: request.id,
    tutorId: tutor.id,
    proposedMode: input.proposedMode,
    hourlyRate: input.hourlyRate,
    durationMinutes: input.durationMinutes,
    proposedDate: input.proposedDate || null,
    message: input.message || null,
    status: "pending",
    expiresAt: new Date(Date.now() + 86400000 * 2).toISOString(),
    createdAt: nowIso(),
  };

  getStore().proposals.unshift(proposal);
  pushNotification(
    request.requesterId,
    "Nouvelle proposition",
    "Un aidant a répondu à ta demande.",
    "new_proposal",
    "proposal",
    proposal.id
  );

  return proposal;
}

export function respondToProposal(input: {
  requesterId: string;
  proposalId: string;
  accept: boolean;
}): DemoBooking | null {
  const proposal = getStore().proposals.find((p) => p.id === input.proposalId);
  if (!proposal) throw new BusinessError("Proposition introuvable.");
  if (proposal.status !== "pending") {
    throw new BusinessError("Cette proposition n'est plus en attente.");
  }

  const request = getStore().requests.find((r) => r.id === proposal.requestId);
  if (!request) throw new BusinessError("Demande introuvable.");
  if (request.requesterId !== input.requesterId) {
    throw new BusinessError("Tu ne peux gérer que tes propres propositions.");
  }

  const tutor = getStore().tutorProfiles.find((t) => t.id === proposal.tutorId);
  if (!tutor) throw new BusinessError("Aidant introuvable.");

  if (!input.accept) {
    proposal.status = "rejected";
    pushNotification(
      tutor.userId,
      "Proposition refusée",
      "Le demandeur a refusé ta proposition.",
      "proposal_rejected",
      "proposal",
      proposal.id
    );
    return null;
  }

  // RG-12 : une seule réservation active par demande
  const activeBooking = getStore().bookings.find(
    (b) =>
      b.requestId === request.id &&
      [
        "pending_payment",
        "confirmed",
        "in_progress",
        "awaiting_completion",
        "disputed",
      ].includes(b.status)
  );
  if (activeBooking) {
    throw new BusinessError(
      "Une réservation active existe déjà pour cette demande."
    );
  }

  proposal.status = "accepted";
  request.status = "matched";

  // Autres propositions pending → rejected
  for (const other of getStore().proposals) {
    if (
      other.requestId === request.id &&
      other.id !== proposal.id &&
      other.status === "pending"
    ) {
      other.status = "rejected";
    }
  }

  const totalAmount = computeTotalAmount(
    proposal.hourlyRate,
    proposal.durationMinutes
  );
  const split = splitBookingAmount(totalAmount, AppConfig.commissionRate);

  const booking: DemoBooking = {
    id: uid("book"),
    requestId: request.id,
    proposalId: proposal.id,
    requesterId: request.requesterId,
    tutorId: tutor.id,
    mode: proposal.proposedMode,
    hourlyRate: proposal.hourlyRate,
    durationMinutes: proposal.durationMinutes,
    totalAmount: split.totalAmount,
    currency: "XOF",
    platformCommissionRate: split.commissionRate,
    platformCommissionAmount: split.platformCommissionAmount,
    tutorDueAmount: split.tutorDueAmount,
    scheduledAt:
      proposal.proposedDate ||
      request.preferredDate ||
      new Date(Date.now() + 86400000).toISOString(),
    status: "pending_payment",
    requesterConfirmedAt: null,
    tutorConfirmedAt: null,
    completedAt: null,
    createdAt: nowIso(),
  };

  getStore().bookings.unshift(booking);

  // Paiement reporté : on marque "confirmé" en mode démo sans encaissement réel
  // pour débloquer le parcours séances. Flag explicite dans le payment stub.
  booking.status = "confirmed";
  getStore().payments.unshift({
    id: uid("pay"),
    bookingId: booking.id,
    provider: "deferred",
    providerReference: null,
    amount: booking.totalAmount,
    currency: "XOF",
    status: "pending",
    paidAt: null,
    createdAt: nowIso(),
  });

  // Solde aidant : en attente jusqu'à validation séance
  const wallet = getStore().wallets.find((w) => w.tutorId === tutor.id);
  if (wallet) {
    wallet.pendingBalance += booking.tutorDueAmount;
    wallet.totalEarned += booking.tutorDueAmount;
  }

  pushNotification(
    tutor.userId,
    "Proposition acceptée",
    "Le demandeur a accepté. Séance confirmée (paiement à brancher plus tard).",
    "proposal_accepted",
    "booking",
    booking.id
  );
  pushNotification(
    request.requesterId,
    "Séance confirmée",
    "Ta réservation est créée. Le paiement sera branché ensuite.",
    "booking_confirmed",
    "booking",
    booking.id
  );

  return booking;
}

export function confirmSessionCompletion(input: {
  userId: string;
  bookingId: string;
}) {
  const booking = getStore().bookings.find((b) => b.id === input.bookingId);
  if (!booking) throw new BusinessError("Réservation introuvable.");

  if (
    !["confirmed", "in_progress", "awaiting_completion"].includes(booking.status)
  ) {
    throw new BusinessError("Cette séance ne peut pas être validée maintenant.");
  }

  const tutor = getStore().tutorProfiles.find((t) => t.id === booking.tutorId);
  const isRequester = booking.requesterId === input.userId;
  const isTutor = tutor?.userId === input.userId;

  if (!isRequester && !isTutor) {
    throw new BusinessError("Tu n'es pas partie prenante de cette séance.");
  }

  if (isRequester) booking.requesterConfirmedAt = nowIso();
  if (isTutor) booking.tutorConfirmedAt = nowIso();

  booking.status = "awaiting_completion";

  if (booking.requesterConfirmedAt && booking.tutorConfirmedAt) {
    booking.status = "completed";
    booking.completedAt = nowIso();

    const wallet = getStore().wallets.find((w) => w.tutorId === booking.tutorId);
    if (wallet) {
      wallet.pendingBalance = Math.max(
        0,
        wallet.pendingBalance - booking.tutorDueAmount
      );
      wallet.availableBalance += booking.tutorDueAmount;
    }

    pushNotification(
      booking.requesterId,
      "Séance terminée",
      "La séance a été validée par les deux parties.",
      "session_completed",
      "booking",
      booking.id
    );
    if (tutor) {
      pushNotification(
        tutor.userId,
        "Séance terminée",
        "Ton montant dû est maintenant disponible pour le prochain reversement.",
        "session_completed",
        "booking",
        booking.id
      );
    }
  }

  return booking;
}

export function disputeBooking(input: { userId: string; bookingId: string }) {
  const booking = getStore().bookings.find((b) => b.id === input.bookingId);
  if (!booking) throw new BusinessError("Réservation introuvable.");

  const tutor = getStore().tutorProfiles.find((t) => t.id === booking.tutorId);
  const allowed =
    booking.requesterId === input.userId || tutor?.userId === input.userId;
  if (!allowed) throw new BusinessError("Action non autorisée.");

  booking.status = "disputed";

  for (const admin of getStore().users.filter((u) => u.role === "admin")) {
    pushNotification(
      admin.id,
      "Litige séance",
      `La réservation ${booking.id} est en litige.`,
      "booking_disputed",
      "booking",
      booking.id
    );
  }

  return booking;
}

export function requestTutorAccess(user: DemoUser, input: {
  bio?: string;
  payoutPhone?: string;
  payoutProvider?: string;
}) {
  const existing = getTutorByUserId(user.id);
  if (existing) {
    if (existing.status === "approved") {
      throw new BusinessError("Ton profil aidant est déjà validé.");
    }
    existing.status = "pending";
    existing.bio = input.bio || existing.bio;
    existing.payoutPhone = input.payoutPhone || existing.payoutPhone;
    existing.payoutProvider = input.payoutProvider || existing.payoutProvider;
    return existing;
  }

  const profile: DemoTutorProfile = {
    id: uid("tutor"),
    userId: user.id,
    status: "pending",
    payoutPhone: input.payoutPhone || user.phone,
    payoutProvider: input.payoutProvider || "TMONEY",
    bio: input.bio || null,
    approvedAt: null,
  };

  getStore().tutorProfiles.push(profile);
  getStore().wallets.push({
    tutorId: profile.id,
    pendingBalance: 0,
    availableBalance: 0,
    totalEarned: 0,
    totalPaidOut: 0,
  });

  for (const admin of getStore().users.filter((u) => u.role === "admin")) {
    pushNotification(
      admin.id,
      "Demande profil aidant",
      `${user.firstName} ${user.lastName} demande à devenir aidant.`,
      "tutor_pending",
      "tutor_profile",
      profile.id
    );
  }

  return profile;
}

export function setTutorStatus(
  tutorId: string,
  status: "approved" | "rejected" | "suspended"
) {
  const tutor = getStore().tutorProfiles.find((t) => t.id === tutorId);
  if (!tutor) throw new BusinessError("Profil aidant introuvable.");

  tutor.status = status;
  tutor.approvedAt = status === "approved" ? nowIso() : tutor.approvedAt;

  pushNotification(
    tutor.userId,
    status === "approved"
      ? "Profil aidant validé"
      : status === "rejected"
        ? "Profil aidant refusé"
        : "Profil aidant suspendu",
    status === "approved"
      ? "Tu peux maintenant répondre aux demandes ouvertes."
      : "Contacte l'administration pour plus d'informations.",
    `tutor_${status}`,
    "tutor_profile",
    tutor.id
  );

  return tutor;
}

export function createModule(input: {
  facultyId: string;
  levelId: string;
  name: string;
  code?: string | null;
  description?: string | null;
}) {
  const faculty = getStore().faculties.find((f) => f.id === input.facultyId);
  const level = getStore().levels.find((l) => l.id === input.levelId);
  if (!faculty || !level) {
    throw new BusinessError("Filière ou niveau invalide.");
  }

  const duplicate = getStore().modules.find(
    (m) =>
      m.facultyId === input.facultyId &&
      m.levelId === input.levelId &&
      m.name.toLowerCase() === input.name.toLowerCase()
  );
  if (duplicate) {
    throw new BusinessError("Ce module existe déjà pour cette filière/niveau.");
  }

  const module: DemoModule = {
    id: uid("mod"),
    facultyId: input.facultyId,
    levelId: input.levelId,
    name: input.name.trim(),
    code: input.code || null,
    description: input.description || null,
    isActive: true,
  };

  getStore().modules.push(module);
  return module;
}

export function toggleModuleActive(moduleId: string) {
  const module = getStore().modules.find((m) => m.id === moduleId);
  if (!module) throw new BusinessError("Module introuvable.");
  module.isActive = !module.isActive;
  return module;
}

export function prepareWeeklyWithdrawals() {
  const created: string[] = [];

  for (const wallet of getStore().wallets) {
    if (wallet.availableBalance <= 0) continue;

    const tutor = getStore().tutorProfiles.find((t) => t.id === wallet.tutorId);
    if (!tutor || tutor.status !== "approved") continue;

    const amount = wallet.availableBalance;
    const withdrawalId = uid("wd");

    getStore().withdrawals.unshift({
      id: withdrawalId,
      tutorId: tutor.id,
      amount,
      status: "pending",
      payoutPhoneSnapshot: tutor.payoutPhone,
      providerReference: null,
      createdAt: nowIso(),
      processedAt: null,
    });

    // En démo sans paiement réel : on marque payé et on met à jour le wallet
    wallet.availableBalance = 0;
    wallet.totalPaidOut += amount;

    const wd = getStore().withdrawals.find((w) => w.id === withdrawalId);
    if (wd) {
      wd.status = "paid";
      wd.processedAt = nowIso();
      wd.providerReference = `DEMO-${withdrawalId}`;
    }

    pushNotification(
      tutor.userId,
      "Reversement effectué",
      `Un reversement de ${amount} FCFA a été enregistré (mode démo).`,
      "withdrawal_paid",
      "withdrawal",
      withdrawalId
    );

    created.push(withdrawalId);
  }

  return created;
}
