// src/app/(dashboard)/student/bookings/page.tsx
import { redirect } from "next/navigation";
import {
  DashboardShell,
  studentNav,
} from "@/components/layout/dashboard-shell";
import { StatusBadge } from "@/components/status-badge";
import { Button } from "@/components/ui/button";
import {
  confirmSessionAction,
  disputeBookingAction,
} from "@/features/bookings/actions";
import { formatDateTime, fullName } from "@/lib/demo/format";
import { getDemoSession } from "@/lib/demo/session";
import { getStore } from "@/lib/demo/store";
import { formatXof } from "@/lib/utils";

export const instant = false;

export default async function StudentBookingsPage() {
  const session = await getDemoSession();
  if (!session) redirect("/login");

  const store = getStore();
  const bookings = store.bookings.filter(
    (b) => b.requesterId === session.userId
  );

  return (
    <DashboardShell
      title="Mes réservations"
      subtitle="Paiement réel non branché — parcours métier actif."
      nav={studentNav}
    >
      <div className="mb-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
        Le paiement sera configuré plus tard. Les séances passent en confirmé
        après acceptation de la proposition pour tester le reste du parcours.
      </div>

      <div className="space-y-3">
        {bookings.map((booking) => {
          const tutor = store.tutorProfiles.find((t) => t.id === booking.tutorId);
          const tutorUser = store.users.find((u) => u.id === tutor?.userId);
          const payment = store.payments.find((p) => p.bookingId === booking.id);

          return (
            <div
              key={booking.id}
              className="rounded-2xl border border-slate-200 bg-white p-4"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h2 className="font-semibold">
                    Séance avec {tutorUser ? fullName(tutorUser) : "aidant"}
                  </h2>
                  <p className="mt-1 text-sm text-slate-600">
                    {formatDateTime(booking.scheduledAt)} ·{" "}
                    {booking.durationMinutes} min ·{" "}
                    <StatusBadge status={booking.mode} />
                  </p>
                  <p className="mt-2 text-sm">
                    Total {formatXof(booking.totalAmount)} · Commission{" "}
                    {formatXof(booking.platformCommissionAmount)} · Aidant{" "}
                    {formatXof(booking.tutorDueAmount)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Paiement : {payment?.status ?? "—"} (provider:{" "}
                    {payment?.provider ?? "—"})
                  </p>
                </div>
                <StatusBadge status={booking.status} />
              </div>

              {["confirmed", "in_progress", "awaiting_completion"].includes(
                booking.status
              ) ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  <form action={confirmSessionAction.bind(null, booking.id)}>
                    <Button type="submit">Confirmer la réalisation</Button>
                  </form>
                  <form action={disputeBookingAction.bind(null, booking.id)}>
                    <Button type="submit" variant="outline">
                      Signaler un problème
                    </Button>
                  </form>
                  {booking.requesterConfirmedAt ? (
                    <p className="text-xs text-emerald-700 self-center">
                      Tu as déjà confirmé.
                    </p>
                  ) : null}
                </div>
              ) : null}
            </div>
          );
        })}
        {bookings.length === 0 ? (
          <p className="text-sm text-slate-600">Aucune réservation.</p>
        ) : null}
      </div>
    </DashboardShell>
  );
}
