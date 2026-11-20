// src/components/status-badge.tsx
import { Badge } from "@/components/ui/badge";

const labels: Record<string, string> = {
  open: "Ouverte",
  matched: "Matchée",
  closed: "Fermée",
  cancelled: "Annulée",
  expired: "Expirée",
  pending: "En attente",
  accepted: "Acceptée",
  rejected: "Refusée",
  withdrawn: "Retirée",
  pending_payment: "Paiement en attente",
  confirmed: "Confirmée",
  in_progress: "En cours",
  awaiting_completion: "À valider",
  completed: "Terminée",
  disputed: "Litige",
  refunded: "Remboursée",
  paid: "Payé",
  failed: "Échoué",
  processing: "En cours",
  approved: "Validé",
  suspended: "Suspendu",
  active: "Actif",
  online: "En ligne",
  in_person: "Présentiel",
};

export function StatusBadge({ status }: { status: string }) {
  const tone =
    status === "approved" || status === "completed" || status === "paid" || status === "active"
      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
      : status === "pending" || status === "pending_payment" || status === "awaiting_completion"
        ? "border-amber-200 bg-amber-50 text-amber-800"
        : status === "rejected" || status === "cancelled" || status === "failed" || status === "suspended" || status === "disputed"
          ? "border-rose-200 bg-rose-50 text-rose-800"
          : status === "online"
            ? "border-sky-200 bg-sky-50 text-sky-800"
            : status === "in_person"
              ? "border-violet-200 bg-violet-50 text-violet-800"
              : "border-slate-200 bg-slate-50 text-slate-700";

  return <Badge variant="outline" className={tone}>{labels[status] ?? status}</Badge>;
}
