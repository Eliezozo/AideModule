// src/app/(dashboard)/student/profile/page.tsx
import { redirect } from "next/navigation";
import {
  DashboardShell,
  studentNav,
} from "@/components/layout/dashboard-shell";
import { StatusBadge } from "@/components/status-badge";
import { getDemoSession } from "@/lib/demo/session";
import { getStore } from "@/lib/demo/store";

export const instant = false;

export default async function StudentProfilePage() {
  const session = await getDemoSession();
  if (!session) redirect("/login");

  const store = getStore();
  const user = store.users.find((u) => u.id === session.userId);
  if (!user) redirect("/login");

  const faculty = store.faculties.find((f) => f.id === user.facultyId);
  const level = store.levels.find((l) => l.id === user.levelId);
  const tutor = store.tutorProfiles.find((t) => t.userId === user.id);

  return (
    <DashboardShell title="Mon profil" nav={studentNav}>
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <dl className="grid gap-4 sm:grid-cols-2">
          <Item label="Nom" value={`${user.firstName} ${user.lastName}`} />
          <Item label="Email" value={user.email} />
          <Item label="Téléphone" value={user.phone ?? "—"} />
          <Item label="N° étudiant" value={user.studentNumber ?? "—"} />
          <Item label="Filière" value={faculty?.name ?? "Non renseignée"} />
          <Item label="Niveau" value={level?.name ?? "Non renseigné"} />
          <Item
            label="Statut compte"
            value={<StatusBadge status={user.accountStatus} />}
          />
          <Item
            label="Profil aidant"
            value={
              tutor ? <StatusBadge status={tutor.status} /> : "Non activé"
            }
          />
        </dl>
      </div>
    </DashboardShell>
  );
}

function Item({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div>
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="mt-1 text-sm font-medium text-slate-900">{value}</dd>
    </div>
  );
}
