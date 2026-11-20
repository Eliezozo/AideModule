import Link from "next/link";
import { ArrowLeft, ArrowRight, BookOpen, Check, GraduationCap, Handshake, MessageSquareText, UserRoundPlus } from "lucide-react";
import { AppConfig } from "@/lib/config";

const steps = [
  { icon: UserRoundPlus, title: "Inscris-toi au campus", text: "Crée ton compte étudiant. Tu peux demander un accompagnement et proposer le tien avec le même profil." },
  { icon: BookOpen, title: "Choisis ton module", text: "Décris ce qui te bloque en sélectionnant un cours du catalogue de ton établissement." },
  { icon: MessageSquareText, title: "Échange avec un aidant", text: "Les aidants validés peuvent répondre. Ils peuvent accepter ta demande ou proposer d’autres conditions." },
  { icon: Handshake, title: "Décidez ensemble", text: "Tu examines les propositions et acceptes celle qui te convient. Aucun engagement n’est pris avant votre accord." },
  { icon: Check, title: "Retrouve-toi pour apprendre", text: "La séance a lieu selon les conditions convenues. Chacun confirme ensuite qu’elle s’est bien déroulée." },
];

export default function HowItWorksPage() {
  return (
    <main className="min-h-screen bg-[#f7f5ef] px-5 py-8 text-[#162c3a] sm:px-8 sm:py-12">
      <div className="mx-auto max-w-4xl">
        <Link href="/" className="inline-flex items-center gap-2 rounded-full px-3 py-2 text-sm font-medium text-[#547068] transition hover:bg-white"><ArrowLeft className="size-4" /> Retour à l’accueil</Link>
        <section className="relative mt-7 overflow-hidden rounded-[2rem] bg-[#183d3b] px-6 py-9 text-white sm:px-10 sm:py-12">
          <div className="absolute -right-12 -top-20 size-64 rounded-full border border-white/10" />
          <div className="absolute -right-2 -top-10 size-44 rounded-full border border-white/10" />
          <div className="relative max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-[#e3bd80]"><GraduationCap className="size-4" /> {AppConfig.appName}</div>
            <h1 className="mt-5 text-3xl font-semibold tracking-tight sm:text-5xl">Un coup de main, <span className="text-[#e7c991]">en quelques étapes.</span></h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-white/70 sm:text-base">Un parcours simple pour trouver un accompagnement adapté et faire circuler les connaissances sur le campus.</p>
          </div>
        </section>

        <section className="relative mt-10 sm:mt-14">
          <div aria-hidden="true" className="absolute bottom-12 left-[25px] top-8 hidden w-px bg-gradient-to-b from-[#d1a66d] via-[#c8d5c4] to-transparent sm:block" />
          <ol className="space-y-4">
            {steps.map(({ icon: Icon, title, text }, index) => (
              <li key={title} className="relative grid gap-4 rounded-2xl border border-[#e7e5dc] bg-[#fffefa] p-5 shadow-sm shadow-[#1b382c]/[0.025] sm:grid-cols-[54px_1fr] sm:gap-5 sm:p-6">
                <div className="relative z-10 flex size-12 items-center justify-center rounded-2xl bg-[#e8efe7] text-[#316451] ring-4 ring-[#f7f5ef]"><Icon className="size-5" /></div>
                <div className="flex items-start justify-between gap-4">
                  <div><p className="text-[10px] font-bold uppercase tracking-[0.17em] text-[#b77955]">Étape 0{index + 1}</p><h2 className="mt-1 text-lg font-semibold text-[#203b42]">{title}</h2><p className="mt-2 max-w-2xl text-sm leading-6 text-[#72807c]">{text}</p></div>
                  <span className="hidden font-mono text-2xl text-[#e5e7de] sm:block">0{index + 1}</span>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section className="mt-8 flex flex-col items-start justify-between gap-4 rounded-2xl bg-[#e8eee5] p-6 sm:flex-row sm:items-center sm:px-7">
          <div><p className="font-semibold text-[#25433e]">À toi de jouer.</p><p className="mt-1 text-sm text-[#6a7b73]">Ton prochain échange commence par une question.</p></div>
          <Link href="/register" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#d17753] px-5 text-sm font-bold text-white transition hover:bg-[#bd6545]">Créer un compte <ArrowRight className="size-4" /></Link>
        </section>
        <p className="mt-8 text-center text-xs text-[#9aa29a]">{AppConfig.appName} · Le campus s’entraide</p>
      </div>
    </main>
  );
}
