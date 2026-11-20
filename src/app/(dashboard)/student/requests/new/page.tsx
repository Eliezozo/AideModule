// src/app/(dashboard)/student/requests/new/page.tsx
import { redirect } from "next/navigation";
import {
  DashboardShell,
  studentNav,
} from "@/components/layout/dashboard-shell";
import { CreateRequestForm } from "@/features/requests/components/create-request-form";
import { getDemoSession } from "@/lib/demo/session";
import { getStore } from "@/lib/demo/store";

export const instant = false;

export default async function NewRequestPage() {
  const session = await getDemoSession();
  if (!session) redirect("/login");

  const store = getStore();

  return (
    <DashboardShell
      title="Nouvelle demande"
      subtitle="Le module doit venir du catalogue administré. Pas de saisie libre."
      nav={studentNav}
    >
      <CreateRequestForm
        faculties={store.faculties
          .filter((f) => f.isActive)
          .map((f) => ({ id: f.id, name: f.name }))}
        levels={store.levels
          .filter((l) => l.isActive)
          .map((l) => ({ id: l.id, name: l.name }))}
        modules={store.modules
          .filter((m) => m.isActive)
          .map((m) => ({
            id: m.id,
            name: m.name,
            facultyId: m.facultyId,
            levelId: m.levelId,
          }))}
      />
    </DashboardShell>
  );
}
