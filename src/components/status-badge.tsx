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
  return <Badge variant="secondary">{labels[status] ?? status}</Badge>;
}
