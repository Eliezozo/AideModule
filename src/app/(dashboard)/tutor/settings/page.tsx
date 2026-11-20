import { Suspense } from "react";
import { redirect } from "next/navigation";
import { DashboardShell, tutorNav } from "@/components/layout/dashboard-shell";
import { DashboardLoading } from "@/components/layout/dashboard-loading";
import { StatusBadge } from "@/components/status-badge";
import { TutorSettingsForm } from "@/features/tutors/components/tutor-settings-form";
import { getTutorByUserId } from "@/lib/demo/business";
import { getDemoSession } from "@/lib/demo/session";

export default function TutorSettingsPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <TutorSettingsContent />
    </Suspense>
  );
}

async function TutorSettingsContent() {
  const session = await getDemoSession();
  if (!session) redirect("/login");

  const tutor = getTutorByUserId(session.userId);

  return (
    <DashboardShell
      title="Mon profil aidant"
      subtitle="Présente-toi et renseigne tes coordonnées pour rejoindre le réseau d’entraide."
      nav={tutorNav}
    >
      {tutor?.status === "approved" ? (
        <section className="max-w-2xl rounded-2xl border border-emerald-200 bg-white p-6 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Ton profil est actif</h2>
              <p className="mt-1 text-sm text-slate-600">Tu peux répondre aux demandes d’accompagnement.</p>
            </div>
            <StatusBadge status={tutor.status} />
          </div>
          {tutor.bio ? <p className="mt-5 whitespace-pre-wrap text-sm leading-6 text-slate-700">{tutor.bio}</p> : null}
          <p className="mt-5 border-t border-slate-100 pt-4 text-sm text-slate-600">
            Coordonnée de reversement : {tutor.payoutProvider ?? "Opérateur non renseigné"} · {tutor.payoutPhone ?? "Numéro non renseigné"}
          </p>
          <p className="mt-3 text-xs text-slate-500">Pour modifier ces informations après validation, contacte l’administration.</p>
        </section>
      ) : (
        <section className="max-w-2xl rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                {tutor ? "Mets à jour ta demande" : "Présente ton profil"}
              </h2>
              <p className="mt-1 text-sm leading-6 text-slate-600">
                L’administration examinera ta demande avant de t’autoriser à répondre aux étudiants.
              </p>
            </div>
            {tutor ? <StatusBadge status={tutor.status} /> : null}
          </div>
          <TutorSettingsForm
            defaultBio={tutor?.bio}
            defaultPhone={tutor?.payoutPhone}
            defaultProvider={tutor?.payoutProvider}
          />
          <p className="mt-5 border-t border-slate-100 pt-4 text-xs leading-5 text-slate-500">
            Tes coordonnées de reversement sont utilisées par l’administration pour préparer les paiements hebdomadaires. Le paiement des séances n’est pas géré sur cet écran.
          </p>
        </section>
      )}
    </DashboardShell>
  );
}
