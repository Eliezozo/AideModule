// src/app/(dashboard)/tutor/requests/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  DashboardShell,
  tutorNav,
} from "@/components/layout/dashboard-shell";
import { StatusBadge } from "@/components/status-badge";
import { getApprovedTutorByUserId } from "@/lib/demo/business";
import { formatDateTime, fullName } from "@/lib/demo/format";
import { getDemoSession } from "@/lib/demo/session";
import { getStore } from "@/lib/demo/store";
import { formatXof } from "@/lib/utils";

export const instant = false;

export default async function TutorRequestsPage() {
  const session = await getDemoSession();
  if (!session) redirect("/login");

  const approved = getApprovedTutorByUserId(session.userId);
  if (!approved) {
    redirect("/tutor/dashboard");
  }

  const store = getStore();
  const requests = store.requests.filter((r) => r.status === "open");

  return (
    <DashboardShell
      title="Demandes ouvertes"
      subtitle="Visibles par tous les aidants validés, sans restriction de filière."
      nav={tutorNav}
    >
      <div className="space-y-3">
        {requests.map((request) => {
          const requester = store.users.find((u) => u.id === request.requesterId);
          const faculty = store.faculties.find((f) => f.id === request.facultyId);
          const level = store.levels.find((l) => l.id === request.levelId);

          return (
            <Link
              key={request.id}
              href={`/tutor/requests/${request.id}`}
              className="block rounded-2xl border border-slate-200 bg-white p-4 hover:border-emerald-300"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">{request.moduleNameSnapshot}</h2>
                  <p className="text-sm text-slate-600">
                    {faculty?.name} · {level?.name} · Demandeur :{" "}
                    {requester ? fullName(requester) : "—"}
                  </p>
                  <p className="mt-2 text-sm text-slate-700 line-clamp-2">
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
            </Link>
          );
        })}
        {requests.length === 0 ? (
          <p className="text-sm text-slate-600">Aucune demande ouverte.</p>
        ) : null}
      </div>
    </DashboardShell>
  );
}
