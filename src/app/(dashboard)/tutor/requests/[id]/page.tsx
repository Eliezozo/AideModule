// src/app/(dashboard)/tutor/requests/[id]/page.tsx
import { notFound, redirect } from "next/navigation";
import {
  DashboardShell,
  tutorNav,
} from "@/components/layout/dashboard-shell";
import { StatusBadge } from "@/components/status-badge";
import { ProposalForm } from "@/features/requests/components/proposal-form";
import { getApprovedTutorByUserId } from "@/lib/demo/business";
import { formatDateTime, fullName } from "@/lib/demo/format";
import { getDemoSession } from "@/lib/demo/session";
import { getStore } from "@/lib/demo/store";
import { formatXof } from "@/lib/utils";

export const instant = false;

export default async function TutorRequestDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await getDemoSession();
  if (!session) redirect("/login");

  const approved = getApprovedTutorByUserId(session.userId);
  if (!approved) redirect("/tutor/dashboard");

  const store = getStore();
  const request = store.requests.find((r) => r.id === id);
  if (!request) notFound();

  const requester = store.users.find((u) => u.id === request.requesterId);

  return (
    <DashboardShell title="Détail de la demande" nav={tutorNav}>
      <div className="space-y-6">
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <div className="flex flex-wrap items-start justify-between gap-3">
            <div>
              <h2 className="text-xl font-semibold">
                {request.moduleNameSnapshot}
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                Demandeur : {requester ? fullName(requester) : "—"}
              </p>
            </div>
            <StatusBadge status={request.status} />
          </div>
          <p className="mt-4 text-slate-700">{request.description}</p>
          <p className="mt-3 text-sm text-slate-600">
            {formatDateTime(request.preferredDate)} ·{" "}
            {request.preferredDurationMinutes} min ·{" "}
            <StatusBadge status={request.preferredMode} />
            {request.budgetAmount != null
              ? ` · Budget ${formatXof(request.budgetAmount)}`
              : ""}
          </p>
        </div>

        {request.status === "open" && request.requesterId !== session.userId ? (
          <ProposalForm
            requestId={request.id}
            defaultMode={request.preferredMode}
            defaultDuration={request.preferredDurationMinutes}
          />
        ) : (
          <p className="text-sm text-slate-600">
            Cette demande n&apos;accepte plus de nouvelles propositions.
          </p>
        )}
      </div>
    </DashboardShell>
  );
}
