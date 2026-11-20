// src/app/(dashboard)/student/requests/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  DashboardShell,
  studentNav,
} from "@/components/layout/dashboard-shell";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { formatDateTime } from "@/lib/demo/format";
import { getDemoSession } from "@/lib/demo/session";
import { getStore } from "@/lib/demo/store";
import { cn, formatXof } from "@/lib/utils";

export const instant = false;

export default async function StudentRequestsPage() {
  const session = await getDemoSession();
  if (!session) redirect("/login");

  const store = getStore();
  const requests = store.requests.filter((r) => r.requesterId === session.userId);

  return (
    <DashboardShell title="Mes demandes" nav={studentNav}>
      <div className="mb-4 flex justify-end">
        <Link
          href="/student/requests/new"
          className={cn(buttonVariants())}
        >
          Nouvelle demande
        </Link>
      </div>
      <div className="space-y-3">
        {requests.map((request) => {
          const proposals = store.proposals.filter(
            (p) => p.requestId === request.id
          );
          return (
            <div
              key={request.id}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{request.moduleNameSnapshot}</h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {request.description}
                  </p>
                  <p className="mt-2 text-xs text-slate-500">
                    {formatDateTime(request.preferredDate)} ·{" "}
                    {request.preferredDurationMinutes} min ·{" "}
                    <StatusBadge status={request.preferredMode} />
                    {request.budgetAmount != null
                      ? ` · Budget ${formatXof(request.budgetAmount)}`
                      : ""}
                  </p>
                </div>
                <StatusBadge status={request.status} />
              </div>
              <p className="mt-3 text-sm text-slate-600">
                {proposals.length} proposition(s)
              </p>
            </div>
          );
        })}
        {requests.length === 0 ? (
          <p className="text-sm text-slate-600">Aucune demande publiée.</p>
        ) : null}
      </div>
    </DashboardShell>
  );
}
