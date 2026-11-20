// src/app/(dashboard)/student/proposals/page.tsx
import { redirect } from "next/navigation";
import {
  DashboardShell,
  studentNav,
} from "@/components/layout/dashboard-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  acceptProposalAction,
  rejectProposalAction,
} from "@/features/requests/actions";
import { formatDateTime, fullName } from "@/lib/demo/format";
import { getDemoSession } from "@/lib/demo/session";
import { getStore } from "@/lib/demo/store";
import { computeTotalAmount } from "@/lib/finance/commission";
import { formatXof } from "@/lib/utils";

export const instant = false;

export default async function StudentProposalsPage() {
  const session = await getDemoSession();
  if (!session) redirect("/login");

  const store = getStore();
  const myRequestIds = store.requests
    .filter((r) => r.requesterId === session.userId)
    .map((r) => r.id);

  const proposals = store.proposals.filter((p) =>
    myRequestIds.includes(p.requestId)
  );

  return (
    <DashboardShell
      title="Propositions reçues"
      subtitle="Accepte une proposition pour créer la réservation (paiement plus tard)."
      nav={studentNav}
    >
      <div className="space-y-3">
        {proposals.map((proposal) => {
          const request = store.requests.find((r) => r.id === proposal.requestId);
          const tutor = store.tutorProfiles.find((t) => t.id === proposal.tutorId);
          const tutorUser = store.users.find((u) => u.id === tutor?.userId);
          const total = computeTotalAmount(
            proposal.hourlyRate,
            proposal.durationMinutes
          );

          return (
            <div
              key={proposal.id}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">
                    {request?.moduleNameSnapshot ?? "Demande"}
                  </h2>
                  <p className="text-sm text-slate-600">
                    Aidant : {tutorUser ? fullName(tutorUser) : "—"}
                  </p>
                  <p className="mt-2 text-sm text-slate-700">
                    {formatXof(proposal.hourlyRate)}/h · {proposal.durationMinutes}{" "}
                    min · Total {formatXof(total)} ·{" "}
                    <StatusBadge status={proposal.proposedMode} />
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Créneau : {formatDateTime(proposal.proposedDate)}
                  </p>
                  {proposal.message ? (
                    <p className="mt-2 text-sm text-slate-600">{proposal.message}</p>
                  ) : null}
                </div>
                <StatusBadge status={proposal.status} />
              </div>

              {proposal.status === "pending" ? (
                <div className="mt-4 flex gap-2">
                  <form action={acceptProposalAction.bind(null, proposal.id)}>
                    <Button type="submit">Accepter</Button>
                  </form>
                  <form action={rejectProposalAction.bind(null, proposal.id)}>
                    <Button type="submit" variant="outline">
                      Refuser
                    </Button>
                  </form>
                </div>
              ) : null}
            </div>
          );
        })}
        {proposals.length === 0 ? (
          <p className="text-sm text-slate-600">Aucune proposition reçue.</p>
        ) : null}
      </div>
    </DashboardShell>
  );
}
