import { Suspense } from "react";
import { redirect } from "next/navigation";
import {
  DashboardShell,
  adminNav,
} from "@/components/layout/dashboard-shell";
import { StatusBadge } from "@/components/status-badge";
import {
  approveTutorAction,
  rejectTutorAction,
  suspendTutorAction,
} from "@/features/tutors/actions";
import { formatDateTime, fullName } from "@/lib/demo/format";
import { getDemoSession } from "@/lib/demo/session";
import { getStore } from "@/lib/demo/store";
import { DashboardLoading } from "@/components/layout/dashboard-loading";

export default function AdminTutorsPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <AdminTutorsContent />
    </Suspense>
  );
}

async function AdminTutorsContent() {
  const session = await getDemoSession();
  if (!session || session.role !== "admin") redirect("/login");

  const store = getStore();
  const tutors = [...store.tutorProfiles].sort((a, b) => {
    if (a.status === "pending" && b.status !== "pending") return -1;
    if (b.status === "pending" && a.status !== "pending") return 1;
    return b.approvedAt?.localeCompare(a.approvedAt ?? "") ?? 0;
  });
  const pendingCount = tutors.filter((tutor) => tutor.status === "pending").length;

  return (
    <DashboardShell
      title="Gestion des aidants"
      subtitle={`${pendingCount} demande(s) en attente de validation`}
      nav={adminNav}
    >
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        Les changements sont enregistrés dans le mode démo local. Ils ne sont
        pas encore persistés dans Supabase.
      </div>

      {tutors.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Aucune demande pour devenir aidant.
        </div>
      ) : (
        <div className="space-y-3">
          {tutors.map((tutor) => {
            const user = store.users.find((candidate) => candidate.id === tutor.userId);
            if (!user) return null;
            const faculty = store.faculties.find((item) => item.id === user.facultyId);
            const level = store.levels.find((item) => item.id === user.levelId);

            return (
              <article
                key={tutor.id}
                className="rounded-2xl border border-slate-200 bg-white p-5"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <h2 className="font-semibold text-slate-900">{fullName(user)}</h2>
                    <p className="mt-1 text-sm text-slate-600">
                      {user.email} · {user.studentNumber ?? "N° étudiant non renseigné"}
                    </p>
                    <p className="mt-1 text-sm text-slate-600">
                      {faculty?.name ?? "Filière non renseignée"} · {level?.name ?? "Niveau non renseigné"}
                    </p>
                  </div>
                  <StatusBadge status={tutor.status} />
                </div>

                {tutor.bio ? (
                  <p className="mt-4 whitespace-pre-wrap text-sm text-slate-700">{tutor.bio}</p>
                ) : (
                  <p className="mt-4 text-sm italic text-slate-500">Aucune présentation fournie.</p>
                )}

                <p className="mt-3 text-xs text-slate-500">
                  {tutor.approvedAt
                    ? `Validé le ${formatDateTime(tutor.approvedAt)}`
                    : "Demande en attente"}
                </p>

                <div className="mt-4 flex flex-wrap gap-2">
                  {tutor.status !== "approved" ? (
                    <form action={approveTutorAction.bind(null, tutor.id)}>
                      <button className="rounded-lg bg-emerald-600 px-3 py-2 text-sm font-medium text-white hover:bg-emerald-700">
                        Valider le profil
                      </button>
                    </form>
                  ) : null}
                  {tutor.status === "pending" ? (
                    <form action={rejectTutorAction.bind(null, tutor.id)}>
                      <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
                        Refuser la demande
                      </button>
                    </form>
                  ) : null}
                  {tutor.status === "approved" ? (
                    <form action={suspendTutorAction.bind(null, tutor.id)}>
                      <button className="rounded-lg border border-red-200 px-3 py-2 text-sm font-medium text-red-700 hover:bg-red-50">
                        Suspendre l&apos;aidant
                      </button>
                    </form>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </DashboardShell>
  );
}
