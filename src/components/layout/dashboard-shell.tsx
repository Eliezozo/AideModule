// src/components/layout/dashboard-shell.tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { logoutAction } from "@/features/auth/actions";
import { AppConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

type NavItem = { href: string; label: string };

export function DashboardShell({
  title,
  subtitle,
  nav,
  children,
}: {
  title: string;
  subtitle?: string;
  nav: NavItem[];
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-emerald-700">
              {AppConfig.appName}
            </p>
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
            {subtitle ? (
              <p className="text-sm text-slate-600">{subtitle}</p>
            ) : null}
          </div>
          <form action={logoutAction}>
            <button
              type="submit"
              className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
            >
              Déconnexion
            </button>
          </form>
        </div>
        <nav className="mx-auto flex w-full max-w-6xl gap-1 overflow-x-auto px-4 pb-3">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-lg px-3 py-1.5 text-sm text-slate-700 hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-6xl px-4 py-6">{children}</main>
    </div>
  );
}

export const studentNav: NavItem[] = [
  { href: "/student/dashboard", label: "Tableau de bord" },
  { href: "/student/requests", label: "Mes demandes" },
  { href: "/student/requests/new", label: "Nouvelle demande" },
  { href: "/student/proposals", label: "Propositions" },
  { href: "/student/bookings", label: "Réservations" },
  { href: "/student/notifications", label: "Notifications" },
  { href: "/student/profile", label: "Profil" },
  { href: "/tutor/dashboard", label: "Espace aidant" },
];

export const tutorNav: NavItem[] = [
  { href: "/tutor/dashboard", label: "Tableau de bord" },
  { href: "/tutor/requests", label: "Demandes ouvertes" },
  { href: "/tutor/proposals", label: "Mes propositions" },
  { href: "/tutor/sessions", label: "Mes séances" },
  { href: "/tutor/earnings", label: "Revenus" },
  { href: "/tutor/settings", label: "Coordonnées" },
  { href: "/student/dashboard", label: "Espace étudiant" },
];

export const adminNav: NavItem[] = [
  { href: "/admin/dashboard", label: "Vue d'ensemble" },
  { href: "/admin/students", label: "Étudiants" },
  { href: "/admin/tutors", label: "Aidants" },
  { href: "/admin/modules", label: "Catalogue" },
  { href: "/admin/requests", label: "Demandes" },
  { href: "/admin/bookings", label: "Réservations" },
  { href: "/admin/finance", label: "Finance" },
  { href: "/admin/withdrawals", label: "Reversements" },
];
