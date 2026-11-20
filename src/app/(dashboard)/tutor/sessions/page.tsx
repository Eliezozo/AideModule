// src/app/(dashboard)/tutor/sessions/page.tsx
import { redirect } from "next/navigation";
import {
  DashboardShell,
  tutorNav,
} from "@/components/layout/dashboard-shell";
import { StatusBadge } from "@/components/status-badge";
import { getApprovedTutorByUserId, getTutorByUserId } from "@/lib/demo/business";
import { formatDateTime, fullName } from "@/lib/demo/format";
import { getDemoSession } from "@/lib/demo/session";
import { getStore } from "@/lib/demo/store";
import { formatXof } from "@/lib/utils";
import { confirmSessionAction, disputeBookingAction } from "@/features/bookings/actions";

export const instant = false;

export default async function TutorSessionsPage() {
  const session = await getDemoSession();
  if (!session) redirect("/login");

  const tutor = getTutorByUserId(session.userId);
  if (!tutor) redirect("/tutor/dashboard");

  const approved = tutor.status === "approved";

  const store = getStore();
  const bookings = store.bookings.filter((b) => b.tutorId === tutor.id);

  return (
    <DashboardShell
      title="Mes séances"
      subtitle="Historique et suivi de tes séances d'aide."
      nav={tutorNav}
    >
      {!approved && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
          Ton profil n&apos;est pas encore validé. Tu ne peux pas gérer de séances.
        </div>
      )}

      {bookings.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          Aucune séance pour le moment.
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="border-b border-slate-200 bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
              <tr>
                <th className="px-4 py-3 text-left">Module</th>
                <th className="px-4 py-3 text-left">Demandeur</th>
                <th className="px-4 py-3 text-left">Mode</th>
                <th className="px-4 py-3 text-left">Date</th>
                <th className="px-4 py-3 text-right">Durée</th>
                <th className="px-4 py-3 text-right">Dû aidant</th>
                <th className="px-4 py-3 text-left">Statut</th>
                <th className="px-4 py-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {bookings.map((booking) => {
                const request = store.requests.find((r) => r.id === booking.requestId);
                const requester = store.users.find((u) => u.id === booking.requesterId);
                const canConfirm = ["confirmed", "in_progress", "awaiting_completion"].includes(booking.status);
                const canDispute = ["confirmed", "in_progress"].includes(booking.status);

                return (
                  <tr key={booking.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {request?.moduleNameSnapshot ?? "—"}
                    </td>
                    <td className="px-4 py-3 text-slate-700">
                      {requester ? fullName(requester) : "—"}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={booking.mode} />
                    </td>
                    <td className="px-4 py-3 text-slate-600">
                      {formatDateTime(booking.scheduledAt)}
                    </td>
                    <td className="px-4 py-3 text-right text-slate-600">
                      {booking.durationMinutes} min
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-slate-800">
                      {formatXof(booking.tutorDueAmount)}
                    </td>
                    <td className="px-4 py-3">
                      <StatusBadge status={booking.status} />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-2">
                        {canConfirm && (
                          <form
                            action={confirmSessionAction.bind(null, booking.id)}
                          >
                            <button
                              type="submit"
                              className="rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-emerald-700"
                            >
                              Confirmer la réalisation
                            </button>
                          </form>
                        )}
                        {canDispute && (
                          <form
                            action={disputeBookingAction.bind(null, booking.id)}
                          >
                            <button
                              type="submit"
                              className="rounded-lg border border-red-300 bg-white px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50"
                            >
                              Signaler un litige
                            </button>
                          </form>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </DashboardShell>
  );
}
