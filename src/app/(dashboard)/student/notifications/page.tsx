// src/app/(dashboard)/student/notifications/page.tsx
import { redirect } from "next/navigation";
import {
  DashboardShell,
  studentNav,
} from "@/components/layout/dashboard-shell";
import { formatDateTime } from "@/lib/demo/format";
import { getDemoSession } from "@/lib/demo/session";
import { getStore } from "@/lib/demo/store";

export const instant = false;

export default async function StudentNotificationsPage() {
  const session = await getDemoSession();
  if (!session) redirect("/login");

  const notifications = getStore().notifications.filter(
    (n) => n.userId === session.userId
  );

  return (
    <DashboardShell title="Notifications" nav={studentNav}>
      <div className="space-y-3">
        {notifications.map((n) => (
          <div
            key={n.id}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="font-semibold">{n.title}</h2>
                <p className="mt-1 text-sm text-slate-600">{n.message}</p>
              </div>
              <p className="text-xs text-slate-500 whitespace-nowrap">
                {formatDateTime(n.createdAt)}
              </p>
            </div>
          </div>
        ))}
        {notifications.length === 0 ? (
          <p className="text-sm text-slate-600">Aucune notification.</p>
        ) : null}
      </div>
    </DashboardShell>
  );
}
