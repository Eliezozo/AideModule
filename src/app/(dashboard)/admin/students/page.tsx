// src/app/(dashboard)/admin/students/page.tsx
import { Suspense } from "react";
import { redirect } from "next/navigation";
import {
  DashboardShell,
  adminNav,
} from "@/components/layout/dashboard-shell";
import { StatusBadge } from "@/components/status-badge";
import { getDemoSession } from "@/lib/demo/session";
import { getStore } from "@/lib/demo/store";
import { DashboardLoading } from "@/components/layout/dashboard-loading";

export default function AdminStudentsPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <AdminStudentsContent />
    </Suspense>
  );
}

async function AdminStudentsContent() {
  const session = await getDemoSession();
  if (!session || session.role !== "admin") redirect("/login");

  const store = getStore();
  const students = store.users.filter((u) => u.role === "student");

  return (
    <DashboardShell
      title="Étudiants"
      subtitle={`${students.length} compte(s) étudiant`}
      nav={adminNav}
    >
      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50">
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Nom
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Email
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  N° étudiant
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Filière
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Niveau
                </th>
                <th className="px-4 py-3 text-left font-medium text-slate-600">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {students.map((student) => {
                const faculty = store.faculties.find(
                  (f) => f.id === student.facultyId
                );
                const level = store.levels.find(
                  (l) => l.id === student.levelId
                );
                return (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-900">
                      {student.firstName} {student.lastName}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {student.email}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {student.studentNumber ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {faculty?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {level?.name ?? "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={student.accountStatus} />
                    </td>
                  </tr>
                );
              })}
              {students.length === 0 && (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-8 text-center text-slate-500"
                  >
                    Aucun étudiant enregistré.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardShell>
  );
}
