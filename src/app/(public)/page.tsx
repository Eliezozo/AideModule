import Link from "next/link";
import {
  ArrowDownRight,
  ArrowRight,
  BookOpen,
  Check,
  GraduationCap,
  LibraryBig,
  MessagesSquare,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { AppConfig } from "@/lib/config";
import { cn } from "@/lib/utils";

const benefits = [
  {
    icon: LibraryBig,
    number: "01",
    title: "Un cadre clair",
    text: "Les demandes s’appuient sur le catalogue officiel de votre établissement.",
  },
  {
    icon: MessagesSquare,
    number: "02",
    title: "Un accord entre étudiants",
    text: "Échangez une proposition, ajustez les conditions et choisissez ensemble.",
  },
  {
    icon: UsersRound,
    number: "03",
    title: "Une communauté qui progresse",
    text: "Demandez de l’aide aujourd’hui, transmettez vos connaissances demain.",
  },
];

export default function HomePage() {
  return (
    <div className="min-h-screen overflow-hidden bg-[#f7f5ef] text-[#162c3a]">
      <header className="relative z-10 mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-5 sm:px-8 lg:px-12">
        <Link href="/" className="group flex items-center gap-3" aria-label={AppConfig.appName}>
          <span className="flex size-11 items-center justify-center rounded-2xl bg-[#163b3a] text-[#f5d9a2] shadow-lg shadow-emerald-950/10 transition-transform group-hover:-rotate-3">
            <GraduationCap className="size-6" strokeWidth={1.8} />
          </span>
          <span>
            <span className="block text-base font-bold tracking-tight text-[#162c3a]">{AppConfig.appName}</span>
            <span className="block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#73817d]">Le campus s’entraide</span>
          </span>
        </Link>
        <nav className="flex items-center gap-2 sm:gap-3" aria-label="Navigation principale">
          <Link href="/how-it-works" className="hidden rounded-full px-4 py-2 text-sm font-medium text-[#52636a] transition hover:bg-white sm:inline-flex">
            Découvrir le parcours
          </Link>
          <Link href="/login" className="rounded-full px-3 py-2 text-sm font-semibold text-[#29464b] transition hover:bg-white sm:px-4">
            Connexion
          </Link>
          <Link href="/register" className="inline-flex items-center gap-2 rounded-full bg-[#163b3a] px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-950/15 transition hover:-translate-y-0.5 hover:bg-[#20504a] sm:px-5">
            Rejoindre <ArrowRight className="size-4" />
          </Link>
        </nav>
      </header>

      <main>
        <section className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-5 pb-20 pt-10 sm:px-8 sm:pt-16 lg:grid-cols-[1.04fr_.96fr] lg:px-12 lg:pb-28 lg:pt-14">
          <div className="absolute -left-48 top-24 size-96 rounded-full bg-[#e9e4d4]/55 blur-3xl" />
          <div className="relative z-10 max-w-2xl">
            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-[#d9dfd5] bg-white/70 px-3.5 py-2 text-xs font-semibold tracking-wide text-[#32635a] shadow-sm">
              <Sparkles className="size-3.5 text-[#ca8058]" />
              L’entraide académique, à hauteur d’étudiant
            </div>
            <h1 className="font-heading text-[clamp(3rem,7vw,5.8rem)] font-semibold leading-[0.99] tracking-[-0.065em] text-[#162c3a]">
              On apprend
              <br />
              <span className="relative inline-block text-[#2c6558]">
                mieux ensemble.
                <svg aria-hidden="true" viewBox="0 0 420 18" className="absolute -bottom-2 left-1 h-3 w-[94%] text-[#e5aa6c]">
                  <path d="M4 12C96 2 288 2 414 10" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="6" />
                </svg>
              </span>
            </h1>
            <p className="mt-8 max-w-xl text-base leading-8 text-[#596a6d] sm:text-lg">
              Le bon coup de pouce peut tout changer. Trouve un étudiant prêt à t’accompagner sur un module, ou partage à ton tour ce que tu maîtrises.
            </p>
            <div className="mt-9 flex flex-wrap items-center gap-3">
              <Link href="/register" className="inline-flex h-12 items-center gap-3 rounded-full bg-[#d17753] px-6 text-sm font-bold text-white shadow-lg shadow-orange-950/15 transition hover:-translate-y-0.5 hover:bg-[#bd6545]">
                Créer mon compte <ArrowRight className="size-4" />
              </Link>
              <Link href="/how-it-works" className={cn(buttonVariants({ variant: "ghost" }), "h-12 rounded-full px-5 text-[#3f5b5c] hover:bg-white")}>
                Voir comment ça marche
              </Link>
            </div>
            <div className="mt-11 flex items-center gap-4 border-t border-[#dce0d8] pt-6">
              <div className="flex -space-x-2" aria-hidden="true">
                {[
                  ["bg-[#eac8a5]", "A"],
                  ["bg-[#a9c5b5]", "K"],
                  ["bg-[#dba99c]", "M"],
                  ["bg-[#d8c991]", "+"],
                ].map(([color, letter]) => (
                  <span key={letter} className={cn("flex size-9 items-center justify-center rounded-full border-2 border-[#f7f5ef] text-xs font-bold text-[#24433f]", color)}>{letter}</span>
                ))}
              </div>
              <p className="text-xs leading-5 text-[#718080]">Une même communauté pour<br /><strong className="font-semibold text-[#40595a]">demander et transmettre</strong></p>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-[550px] lg:ml-auto">
            <div className="absolute -right-5 top-8 size-24 rounded-full border border-[#e0b982]/60" />
            <div className="absolute -bottom-7 -left-7 size-36 rounded-full bg-[#e4e8db]" />
            <div className="relative overflow-hidden rounded-[2rem] bg-[#183d3b] p-6 shadow-2xl shadow-[#193a35]/20 sm:p-8">
              <div className="absolute -right-16 -top-24 size-72 rounded-full border border-white/10" />
              <div className="absolute -right-5 -top-12 size-52 rounded-full border border-white/10" />
              <div className="relative flex items-center justify-between text-white/65">
                <span className="text-[10px] font-semibold uppercase tracking-[0.22em]">Carnet de campus · 01</span>
                <BookOpen className="size-5 text-[#e9bc79]" />
              </div>
              <div className="relative mt-10">
                <p className="text-sm font-medium text-[#d9c9a9]">Cette semaine, au programme</p>
                <h2 className="mt-2 max-w-sm text-3xl font-semibold leading-tight tracking-tight text-white sm:text-4xl">Une question devient un échange.</h2>
              </div>

              <div className="relative mt-9 space-y-3">
                <div className="rounded-2xl border border-white/10 bg-white/[0.08] p-4 backdrop-blur-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#e7c990] text-[#26423c]"><BookOpen className="size-5" /></span>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2"><p className="text-sm font-semibold text-white">Comprendre les intégrales</p><span className="rounded-full bg-[#d9edd9] px-2.5 py-1 text-[10px] font-bold text-[#35624c]">Nouveau</span></div>
                      <p className="mt-1 text-xs text-white/55">Mathématiques · Licence 1</p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-[#f0d9b3]"><span className="size-1.5 rounded-full bg-[#e9bc79]" /> Demande d’accompagnement publiée</div>
                    </div>
                  </div>
                </div>
                <div className="ml-8 rounded-2xl bg-[#f6f2e8] p-4 shadow-lg sm:ml-14">
                  <div className="flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-[#c1d7c7] text-sm font-bold text-[#315746]">AK</span>
                    <div className="flex-1">
                      <div className="flex items-center justify-between gap-2"><p className="text-sm font-bold text-[#203b3d]">Afi propose son aide</p><span className="text-[10px] text-[#77827c]">À l’instant</span></div>
                      <p className="mt-1 text-xs leading-5 text-[#657371]">« On peut revoir la méthode pas à pas, puis faire un exercice ensemble. »</p>
                    </div>
                  </div>
                  <div className="mt-3 flex items-center justify-between border-t border-[#e5e3d9] pt-3 text-[11px]">
                    <span className="flex items-center gap-1.5 font-medium text-[#4d6e5b]"><Check className="size-3.5" /> Proposition reçue</span>
                    <span className="font-semibold text-[#637271]">À vous de choisir</span>
                  </div>
                </div>
              </div>
              <div className="relative mt-8 flex items-center justify-between border-t border-white/10 pt-5">
                <span className="text-xs text-white/55">Un compte. Deux façons de progresser.</span>
                <ArrowDownRight className="size-5 text-[#e9bc79]" />
              </div>
            </div>
            <div className="absolute -left-8 top-1/2 hidden -translate-y-1/2 -rotate-6 rounded-xl bg-[#e8b975] px-4 py-3 text-xs font-bold text-[#31463c] shadow-xl sm:block">
              Le savoir se partage ✳
            </div>
          </div>
        </section>

        <section className="border-y border-[#e6e4da] bg-[#fffefa]">
          <div className="mx-auto grid max-w-7xl gap-0 px-5 py-6 sm:grid-cols-3 sm:px-8 lg:px-12">
            <div className="flex items-center gap-3 py-3 sm:border-r sm:border-[#e8e6de] sm:px-5 sm:first:pl-0">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#e5eee5] text-[#3f725c]"><LibraryBig className="size-5" /></span>
              <div><p className="text-sm font-semibold text-[#243e43]">Modules de votre catalogue</p><p className="mt-0.5 text-xs text-[#7b8781]">Un cadre académique organisé</p></div>
            </div>
            <div className="flex items-center gap-3 border-[#e8e6de] py-3 sm:border-r sm:px-7">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#f8e8dc] text-[#bd7051]"><MessagesSquare className="size-5" /></span>
              <div><p className="text-sm font-semibold text-[#243e43]">Des propositions, votre choix</p><p className="mt-0.5 text-xs text-[#7b8781]">Vous convenez ensemble des conditions</p></div>
            </div>
            <div className="flex items-center gap-3 py-3 sm:pl-7">
              <span className="flex size-10 items-center justify-center rounded-xl bg-[#f4edda] text-[#99763e]"><UsersRound className="size-5" /></span>
              <div><p className="text-sm font-semibold text-[#243e43]">Étudiant aujourd’hui, aidant demain</p><p className="mt-0.5 text-xs text-[#7b8781]">Un compte pour participer à son rythme</p></div>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-12 lg:py-28">
          <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b46c4f]">L’esprit Campus Tutor</p>
              <h2 className="mt-3 max-w-xl text-3xl font-semibold tracking-tight text-[#162c3a] sm:text-4xl">Un peu de méthode. Beaucoup d’entraide.</h2>
            </div>
            <p className="max-w-sm text-sm leading-6 text-[#6f7c79]">Un espace pensé pour rendre les échanges académiques simples, lisibles et utiles.</p>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {benefits.map(({ icon: Icon, number, title, text }) => (
              <article key={number} className="group rounded-[1.5rem] border border-[#e7e5dc] bg-[#fffefa] p-6 transition duration-300 hover:-translate-y-1 hover:border-[#cbd9ce] hover:shadow-xl hover:shadow-[#203c32]/[0.06] sm:p-7">
                <div className="flex items-center justify-between">
                  <span className="flex size-12 items-center justify-center rounded-2xl bg-[#e8efe7] text-[#326451] transition group-hover:bg-[#dce9dc]"><Icon className="size-5" /></span>
                  <span className="font-mono text-xs text-[#a2aaa2]">{number} / 03</span>
                </div>
                <h3 className="mt-8 text-lg font-semibold text-[#203b42]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#74807d]">{text}</p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center justify-between gap-5 rounded-[1.5rem] bg-[#e9eee5] p-6 sm:flex-row sm:px-8 sm:py-7">
            <div><p className="text-lg font-semibold text-[#203b42]">Prêt à faire le premier pas ?</p><p className="mt-1 text-sm text-[#657771]">Ta prochaine séance de travail commence ici.</p></div>
            <Link href="/register" className="inline-flex h-11 items-center gap-2 rounded-full bg-[#163b3a] px-5 text-sm font-semibold text-white transition hover:bg-[#20504a]">Rejoindre la communauté <ArrowRight className="size-4" /></Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-[#e5e3da] bg-[#f1efe8]">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-5 py-6 text-xs text-[#7a8580] sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span className="font-semibold text-[#405c56]">{AppConfig.appName} <span className="font-normal text-[#909993]">· Le campus s’entraide</span></span>
          <span>Apprendre, transmettre, avancer ensemble.</span>
        </div>
      </footer>
    </div>
  );
}
