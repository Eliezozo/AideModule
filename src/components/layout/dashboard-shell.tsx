import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  CalendarDays,
  GraduationCap,
  LayoutDashboard,
  LogOut,
  MessageSquareText,
  NotebookPen,
  Settings2,
  ShieldCheck,
  UsersRound,
  WalletCards,
  type LucideIcon,
} from "lucide-react";
import { logoutAction } from "@/features/auth/actions";
import { AppConfig } from "@/lib/config";

type NavItem = { href: string; label: string; icon: LucideIcon };

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
    <div className="min-h-screen bg-[#f5f5f0] text-[#1b3038]">
      <div className="h-1 bg-gradient-to-r from-[#d17b55] via-[#d8b873] to-[#3e7967]" />
      <header className="border-b border-[#e3e5dd] bg-[#fffefa]">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-7 lg:px-10">
          <div className="flex min-w-0 items-center gap-3.5">
            <Link href="/" className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-[#173e3b] text-[#f0ce8d] shadow-sm" aria-label={AppConfig.appName}>
              <GraduationCap className="size-6" />
            </Link>
            <div className="min-w-0">
              <p className="truncate text-[10px] font-bold uppercase tracking-[0.19em] text-[#698078]">{AppConfig.appName} <span className="text-[#c2a66d]">/</span> Espace campus</p>
              <h1 className="truncate text-lg font-semibold tracking-tight text-[#1b3038]">{title}</h1>
              {subtitle ? <p className="hidden truncate text-xs text-[#77837f] sm:block">{subtitle}</p> : null}
            </div>
          </div>
          <form action={logoutAction}>
            <button type="submit" className="inline-flex h-9 items-center gap-2 rounded-full border border-[#dfe3dc] bg-white px-3 text-xs font-semibold text-[#526563] transition hover:border-[#cbd6ca] hover:bg-[#f5f8f3]">
              <LogOut className="size-3.5" /> <span className="hidden sm:inline">Déconnexion</span>
            </button>
          </form>
        </div>
        <nav className="mx-auto flex w-full max-w-7xl gap-1.5 overflow-x-auto px-4 pb-3 sm:px-7 lg:px-10" aria-label="Navigation de l’espace">
          {nav.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.href} href={item.href} className="group inline-flex shrink-0 items-center gap-2 rounded-full border border-transparent px-3 py-2 text-xs font-medium text-[#647471] transition hover:border-[#dce5da] hover:bg-[#f3f7f1] hover:text-[#27564c]">
                <Icon className="size-3.5 text-[#82968a] transition group-hover:text-[#34705c]" />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>
      <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-7 sm:py-8 lg:px-10">{children}</main>
      <footer className="mx-auto flex max-w-7xl items-center justify-between px-4 pb-6 pt-2 text-[10px] font-medium tracking-wide text-[#98a19a] sm:px-7 lg:px-10">
        <span>Le campus s’entraide</span>
        <span className="inline-flex items-center gap-1">Apprendre ensemble <ArrowUpRight className="size-3" /></span>
      </footer>
    </div>
  );
}

export const studentNav: NavItem[] = [
  { href: "/student/dashboard", label: "Accueil", icon: LayoutDashboard },
  { href: "/student/requests", label: "Mes demandes", icon: NotebookPen },
  { href: "/student/requests/new", label: "Nouvelle demande", icon: BookOpen },
  { href: "/student/proposals", label: "Propositions", icon: MessageSquareText },
  { href: "/student/bookings", label: "Séances", icon: CalendarDays },
  { href: "/student/notifications", label: "Notifications", icon: ShieldCheck },
  { href: "/student/profile", label: "Mon profil", icon: Settings2 },
  { href: "/tutor/dashboard", label: "Espace aidant", icon: GraduationCap },
];

export const tutorNav: NavItem[] = [
  { href: "/tutor/dashboard", label: "Accueil", icon: LayoutDashboard },
  { href: "/tutor/requests", label: "Demandes", icon: BookOpen },
  { href: "/tutor/proposals", label: "Mes propositions", icon: MessageSquareText },
  { href: "/tutor/sessions", label: "Mes séances", icon: CalendarDays },
  { href: "/tutor/earnings", label: "Mes revenus", icon: WalletCards },
  { href: "/tutor/settings", label: "Coordonnées", icon: Settings2 },
  { href: "/student/dashboard", label: "Espace étudiant", icon: GraduationCap },
];

export const adminNav: NavItem[] = [
  { href: "/admin/dashboard", label: "Vue d’ensemble", icon: LayoutDashboard },
  { href: "/admin/students", label: "Étudiants", icon: UsersRound },
  { href: "/admin/tutors", label: "Aidants", icon: GraduationCap },
];
