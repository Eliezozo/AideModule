// src/lib/utils.ts
export { cn } from "cn";

/** Montants entiers en FCFA — jamais de float. */
export function formatXof(amount: number): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "XOF",
    maximumFractionDigits: 0,
  }).format(amount);
}
