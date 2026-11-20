// src/lib/finance/commission.ts
import { AppConfig } from "@/lib/config";

/**
 * Calcul serveur des 30 % / 70 %.
 * Montants entiers FCFA. Arrondi : commission = round(total * rate / 100),
 * reste à l'aidant pour que la somme soit exacte.
 */
export function splitBookingAmount(
  totalAmount: number,
  commissionRate = AppConfig.commissionRate
) {
  if (!Number.isInteger(totalAmount) || totalAmount <= 0) {
    throw new Error("Le montant total doit être un entier positif en FCFA.");
  }

  if (commissionRate < 0 || commissionRate > 100) {
    throw new Error("Le taux de commission est invalide.");
  }

  const platformCommissionAmount = Math.round(
    (totalAmount * commissionRate) / 100
  );
  const tutorDueAmount = totalAmount - platformCommissionAmount;

  return {
    totalAmount,
    commissionRate,
    platformCommissionAmount,
    tutorDueAmount,
  };
}

/** Prix total = tarif horaire × durée (minutes) / 60, arrondi à l'entier FCFA. */
export function computeTotalAmount(
  hourlyRate: number,
  durationMinutes: number
) {
  if (!Number.isInteger(hourlyRate) || hourlyRate <= 0) {
    throw new Error("Le tarif horaire doit être un entier positif.");
  }
  if (!Number.isInteger(durationMinutes) || durationMinutes <= 0) {
    throw new Error("La durée doit être un entier positif.");
  }

  return Math.round((hourlyRate * durationMinutes) / 60);
}
