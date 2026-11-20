// src/app/(dashboard)/admin/dashboard/page.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import {
  DashboardShell,
  adminNav,
} from "@/components/layout/dashboard-shell";
import { getDemoSession } from "@/lib/demo/session";
import { getStore } from "@/lib/demo/store";
import { DashboardLoading } from "@/components/layout/dashboard-loading";

export default function AdminDashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <AdminDashboardContent />
    </Suspense>
  );
}

async function AdminDashboardContent() {
  const session = await getDemoSession();
  if (!session || session.role !== "admin") redirect("/login");

  const store = getStore();

  const students = store.users.filter((u) => u.role === "student");
  const tutorsApproved = store.tutorProfiles.filter(
    (t) => t.status === "approved"
  );
  const tutorsPending = store.tutorProfiles.filter(
    (t) => t.status === "pending"
  );
  const openRequests = store.requests.filter((r) => r.status === "open");
  const activeBookings = store.bookings.filter((b) =>
    ["confirmed", "in_progress", "awaiting_completion"].includes(b.status)
  );

  return (
    <DashboardShell
      title="Administration"
      subtitle="Vue d'ensemble de la plateforme"
      nav={adminNav}
    >
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <Stat label="Étudiants" value={String(students.length)} />
        <Stat
          label="Aidants validés"
          value={String(tutorsApproved.length)}
        />
        <Stat
          label="Aidants en attente"
          value={String(tutorsPending.length)}
        />
        <Stat
          label="Demandes ouvertes"
          value={String(openRequests.length)}
        />
        <Stat
          label="Réservations actives"
          value={String(activeBookings.length)}
        />
        <Stat
          label="Total réservations"
          value={String(store.bookings.length)}
        />
        <Stat
          label="Modules au catalogue"
          value={String(store.modules.length)}
        />
        <Stat
          label="Reversements"
          value={String(store.withdrawals.length)}
        />
      </div>
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
