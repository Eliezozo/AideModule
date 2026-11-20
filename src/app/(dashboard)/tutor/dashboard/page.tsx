// src/app/(dashboard)/tutor/dashboard/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  DashboardShell,
  tutorNav,
} from "@/components/layout/dashboard-shell";
import { StatusBadge } from "@/components/status-badge";
import { buttonVariants } from "@/components/ui/button";
import { getApprovedTutorByUserId, getTutorByUserId } from "@/lib/demo/business";
import { getDemoSession } from "@/lib/demo/session";
import { getStore } from "@/lib/demo/store";
import { cn, formatXof } from "@/lib/utils";

export const instant = false;

export default async function TutorDashboardPage() {
  const session = await getDemoSession();
  if (!session) redirect("/login");

  const store = getStore();
  const user = store.users.find((u) => u.id === session.userId);
  if (!user) redirect("/login");

  const tutor = getTutorByUserId(user.id);
  const approved = getApprovedTutorByUserId(user.id);
  const openRequests = store.requests.filter((r) => r.status === "open");
  const wallet = tutor
    ? store.wallets.find((w) => w.tutorId === tutor.id)
    : null;
  const myProposals = tutor
    ? store.proposals.filter((p) => p.tutorId === tutor.id)
    : [];

  return (
    <DashboardShell
      title="Espace aidant"
      subtitle="Consulte les demandes ouvertes et suis tes montants dus."
      nav={tutorNav}
    >
      {!tutor ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5">
          <h2 className="font-semibold">Active ton profil aidant</h2>
          <p className="mt-2 text-sm text-slate-600">
            Complète tes coordonnées de reversement. L&apos;admin doit valider
            ton profil avant que tu puisses répondre.
          </p>
          <Link
            href="/tutor/settings"
            className={cn(buttonVariants(), "mt-4 inline-flex")}
          >
            Demander l&apos;accès aidant
          </Link>
        </div>
      ) : (
        <>
          <div className="mb-4 flex items-center gap-2 text-sm">
            Statut profil : <StatusBadge status={tutor.status} />
          </div>
          <div className="grid gap-4 sm:grid-cols-4">
            <Stat label="Demandes ouvertes" value={String(openRequests.length)} />
            <Stat label="Mes propositions" value={String(myProposals.length)} />
            <Stat
              label="En attente"
              value={formatXof(wallet?.pendingBalance ?? 0)}
            />
            <Stat
              label="Disponible"
              value={formatXof(wallet?.availableBalance ?? 0)}
            />
          </div>
          {approved ? (
            <div className="mt-6">
              <Link
                href="/tutor/requests"
                className={cn(buttonVariants())}
              >
                Voir les demandes ouvertes
              </Link>
            </div>
          ) : (
            <p className="mt-4 text-sm text-amber-800">
              Ton profil n&apos;est pas encore validé. Tu ne peux pas répondre
              aux demandes.
            </p>
          )}
        </>
      )}
    </DashboardShell>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
