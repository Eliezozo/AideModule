// src/features/payments/simulated-provider.ts
/**
 * Prestataire de paiement SIMULÉ pour le MVP / démo.
 * Ne jamais considérer un redirect navigateur comme preuve de paiement :
 * seul le webhook (ou confirmation serveur) crédite le ledger.
 */

export type SimulatedPaymentIntent = {
  provider: "simulated";
  reference: string;
  amount: number;
  currency: "XOF";
  checkoutUrl: string;
  status: "pending";
};

export function createSimulatedPaymentIntent(input: {
  bookingId: string;
  amount: number;
  appUrl: string;
}): SimulatedPaymentIntent {
  const reference = `sim_${input.bookingId}_${Date.now()}`;

  return {
    provider: "simulated",
    reference,
    amount: input.amount,
    currency: "XOF",
    checkoutUrl: `${input.appUrl}/student/payments/simulate?ref=${reference}&booking=${input.bookingId}`,
    status: "pending",
  };
}

export function verifySimulatedWebhook(payload: {
  reference: string;
  amount: number;
  status: string;
  secret: string;
}) {
  const expected = process.env.PAYMENT_WEBHOOK_SECRET ?? "dev-simulated-secret";
  if (payload.secret !== expected) {
    return { ok: false as const, error: "Signature webhook invalide" };
  }
  if (payload.status !== "paid") {
    return { ok: false as const, error: "Statut non payé" };
  }
  return { ok: true as const };
}
