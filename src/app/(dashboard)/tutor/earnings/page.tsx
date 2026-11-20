// src/app/(dashboard)/tutor/earnings/page.tsx
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
import { formatXof } from "@/lib/utils";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export const instant = false;

export default async function TutorEarningsPage() {
  const session = await getDemoSession();
  if (!session) redirect("/login");

  const tutor = getTutorByUserId(session.userId);
  if (!tutor) redirect("/tutor/dashboard");

  if (tutor.status !== "approved") {
    return (
      <DashboardShell
        title="Revenus"
        subtitle="Suivi de tes montants dus."
        nav={tutorNav}
      >
        <div className="rounded-2xl border border-slate-200 bg-white p-8">
          <h2 className="font-semibold text-slate-800">Accès non disponible</h2>
          <p className="mt-2 text-sm text-slate-600">
            {tutor.status === "pending"
              ? "Ton profil est en attente de validation. Les informations de revenus seront disponibles une fois validé."
              : "Ton profil aidant n'est pas actif. Contacte l'administration pour plus d'informations."}
          </p>
          <Link
            href="/tutor/settings"
            className={cn(buttonVariants({ variant: "outline" }), "mt-4 inline-flex")}
          >
            Voir mes coordonnées
          </Link>
        </div>
      </DashboardShell>
    );
  }

  const store = getStore();
  const wallet = store.wallets.find((w) => w.tutorId === tutor.id);
  const withdrawals = store.withdrawals.filter((w) => w.tutorId === tutor.id);

  return (
    <DashboardShell
      title="Revenus"
      subtitle="Suivi de tes montants dus et reversements."
      nav={tutorNav}
    >
      <div className="space-y-6">
        {/* Wallet summary */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <StatCard
            label="En attente de validation"
            value={formatXof(wallet?.pendingBalance ?? 0)}
          />
          <StatCard
            label="Disponible"
            value={formatXof(wallet?.availableBalance ?? 0)}
          />
          <StatCard
            label="Total cumulé"
            value={formatXof(wallet?.totalEarned ?? 0)}
          />
          <StatCard
            label="Reversements reçus"
            value={formatXof(wallet?.totalPaidOut ?? 0)}
          />
        </div>

        {/* Withdrawals list */}
        <div className="rounded-2xl border border-slate-200 bg-white">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-800">Historique des reversements</h2>
          </div>

          {withdrawals.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              Aucun reversement enregistré pour le moment.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-right">Montant</th>
                  <th className="px-4 py-3 text-left">Statut</th>
                  <th className="px-4 py-3 text-left">Référence provider</th>
                  <th className="px-4 py-3 text-left">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {withdrawals.map((wd) => (
                  <tr key={wd.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 text-right font-medium text-slate-800">
                      {formatXof(wd.amount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={wd.status} />
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-slate-600">
                      {wd.providerReference ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDateTime(wd.processedAt ?? wd.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </DashboardShell>
  );
}

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-xl font-semibold text-slate-900">{value}</p>
    </div>
  );
}
