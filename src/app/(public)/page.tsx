// src/app/(public)/page.tsx
import Link from "next/link";
import { ArrowRight, BookOpen, ShieldCheck, Wallet } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AppConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 via-white to-slate-50">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-6">
        <div className="text-lg font-semibold tracking-tight text-emerald-900">
          {AppConfig.appName}
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/login"
            className={cn(buttonVariants({ variant: "ghost" }))}
          >
            Connexion
          </Link>
          <Link href="/register" className={cn(buttonVariants())}>
            Créer un compte
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 pt-10">
        <section className="max-w-3xl">
          <p className="mb-3 text-sm font-medium uppercase tracking-wide text-emerald-700">
            Aide académique entre étudiants
          </p>
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl">
            Trouve un aidant. Propose ton aide. Gagne en toute transparence.
          </h1>
          <p className="mt-5 text-lg text-slate-600">
            Publie une demande sur un module officiel, reçois des propositions,
            paie la plateforme. Les aidants sont payés chaque semaine après
            validation des séances. Commission plateforme :{" "}
            {AppConfig.commissionRate}&nbsp;%.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href="/register" className={cn(buttonVariants({ size: "lg" }))}>
              Commencer
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/how-it-works"
              className={cn(buttonVariants({ size: "lg", variant: "outline" }))}
            >
              Comment ça marche
            </Link>
          </div>
        </section>

        <section className="mt-16 grid gap-6 sm:grid-cols-3">
          <Feature
            icon={<BookOpen className="size-5 text-emerald-700" />}
            title="Catalogue officiel"
            text="Filières, niveaux et modules gérés par l'administration. Aucun module inventé."
          />
          <Feature
            icon={<ShieldCheck className="size-5 text-emerald-700" />}
            title="Accord avant paiement"
            text="L'aidant propose, le demandeur accepte, puis seulement le paiement est lancé."
          />
          <Feature
            icon={<Wallet className="size-5 text-emerald-700" />}
            title="Reversements clairs"
            text="70 % dus à l'aidant, 30 % commission. Suivi des montants et preuves admin."
          />
        </section>
      </main>
    </div>
  );
}

function Feature({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-emerald-50">
        {icon}
      </div>
      <h2 className="font-semibold text-slate-900">{title}</h2>
      <p className="mt-2 text-sm text-slate-600">{text}</p>
    </div>
  );
}
