// src/app/(public)/how-it-works/page.tsx
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const steps = [
  "Crée ton compte étudiant.",
  "Publie une demande en choisissant un module du catalogue.",
  "Un aidant validé accepte ou fait une contre-proposition.",
  "Tu acceptes les conditions finales.",
  "Tu paies 100 % à la plateforme.",
  "Après la séance validée, l'aidant reçoit sa part (70 %) au reversement hebdomadaire.",
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto min-h-screen w-full max-w-3xl px-4 py-12">
      <h1 className="text-3xl font-bold text-slate-900">Comment ça marche</h1>
      <ol className="mt-8 space-y-4">
        {steps.map((step, index) => (
          <li key={step} className="flex gap-3 text-slate-700">
            <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-sm font-semibold text-emerald-800">
              {index + 1}
            </span>
            <span>{step}</span>
          </li>
        ))}
      </ol>
      <div className="mt-10">
        <Link href="/register" className={cn(buttonVariants())}>
          Créer un compte
        </Link>
      </div>
    </div>
  );
}
