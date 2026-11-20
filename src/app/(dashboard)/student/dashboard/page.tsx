// src/app/(dashboard)/student/dashboard/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  DashboardShell,
  studentNav,
} from "@/components/layout/dashboard-shell";
import { StatusBadge } from "@/components/status-badge";
import { getDemoSession } from "@/lib/demo/session";
import { getStore } from "@/lib/demo/store";
import { formatXof } from "@/lib/utils";

export const instant = false;

export default async function StudentDashboardPage() {
  const session = await getDemoSession();
  if (!session) redirect("/login");

  const store = getStore();
  const user = store.users.find((u) => u.id === session.userId);
  if (!user) redirect("/login");

  const myRequests = store.requests.filter((r) => r.requesterId === user.id);
  const myBookings = store.bookings.filter((b) => b.requesterId === user.id);
  const pendingProposals = store.proposals.filter(
    (p) =>
      p.status === "pending" &&
      myRequests.some((r) => r.id === p.requestId)
  );
  const unread = store.notifications.filter(
    (n) => n.userId === user.id && !n.readAt
  ).length;

  return (
    <DashboardShell
      title={`Bonjour, ${user.firstName}`}
      subtitle="Espace étudiant — un seul compte pour demander et aider."
      nav={studentNav}
    >
      <div className="grid gap-4 sm:grid-cols-4">
        <Stat label="Mes demandes" value={String(myRequests.length)} />
        <Stat label="Propositions en attente" value={String(pendingProposals.length)} />
        <Stat label="Réservations" value={String(myBookings.length)} />
        <Stat label="Notifications" value={String(unread)} />
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Link
          href="/student/requests/new"
          className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5"
        >
          <h2 className="font-semibold text-emerald-900">Demander de l&apos;aide</h2>
          <p className="mt-2 text-sm text-emerald-800/80">
            Choisis un module du catalogue officiel et publie ta demande.
          </p>
        </Link>
        <Link
          href="/tutor/dashboard"
          className="rounded-2xl border border-slate-200 bg-white p-5"
        >
          <h2 className="font-semibold text-slate-900">Devenir / espace aidant</h2>
          <p className="mt-2 text-sm text-slate-600">
            Active ton profil aidant et réponds aux demandes ouvertes.
          </p>
        </Link>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold">Dernières demandes</h2>
        <div className="space-y-3">
          {myRequests.slice(0, 5).map((request) => (
            <div
              key={request.id}
              className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-200 bg-white p-4"
            >
              <div>
                <p className="font-medium">{request.moduleNameSnapshot}</p>
                <p className="text-sm text-slate-600 line-clamp-1">
                  {request.description}
                </p>
                {request.budgetAmount != null ? (
                  <p className="mt-1 text-xs text-slate-500">
                    Budget : {formatXof(request.budgetAmount)}
                  </p>
                ) : null}
              </div>
              <StatusBadge status={request.status} />
            </div>
          ))}
          {myRequests.length === 0 ? (
            <p className="text-sm text-slate-600">Aucune demande pour le moment.</p>
          ) : null}
        </div>
      </section>
    </DashboardShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-2xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
