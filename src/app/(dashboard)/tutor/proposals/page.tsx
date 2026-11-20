// src/app/(dashboard)/tutor/proposals/page.tsx
import { redirect } from "next/navigation";
import {
  DashboardShell,
  tutorNav,
} from "@/components/layout/dashboard-shell";
import { StatusBadge } from "@/components/status-badge";
import { getTutorByUserId } from "@/lib/demo/business";
import { formatDateTime } from "@/lib/demo/format";
import { getDemoSession } from "@/lib/demo/session";
import { getStore } from "@/lib/demo/store";
import { computeTotalAmount } from "@/lib/finance/commission";
import { formatXof } from "@/lib/utils";

export const instant = false;

export default async function TutorProposalsPage() {
  const session = await getDemoSession();
  if (!session) redirect("/login");

  const tutor = getTutorByUserId(session.userId);
  if (!tutor) redirect("/tutor/settings");

  const store = getStore();
  const proposals = store.proposals.filter((p) => p.tutorId === tutor.id);

  return (
    <DashboardShell title="Mes propositions" nav={tutorNav}>
      <div className="space-y-3">
        {proposals.map((proposal) => {
          const request = store.requests.find((r) => r.id === proposal.requestId);
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
                  <p className="mt-1 text-sm text-slate-600">
                    {formatXof(proposal.hourlyRate)}/h ·{" "}
                    {proposal.durationMinutes} min · Total {formatXof(total)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    {formatDateTime(proposal.proposedDate)}
                  </p>
                </div>
                <StatusBadge status={proposal.status} />
              </div>
            </div>
          );
        })}
        {proposals.length === 0 ? (
          <p className="text-sm text-slate-600">Aucune proposition envoyée.</p>
        ) : null}
      </div>
    </DashboardShell>
  );
}
