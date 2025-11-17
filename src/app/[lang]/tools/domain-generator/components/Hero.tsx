// src/app/[lang]/tools/domain-generator/components/Hero.tsx
import Image from "next/image";
import Link from "next/link";
import { Sparkles, Zap, Cpu } from "lucide-react";

type HeroProps = {
  lang: string; // je kunt dit straks strakker typen als Lang
};

export default function Hero({ lang }: HeroProps) {
  return (
    <section className="bg-[#f5e9ff]">
      <div className="mx-auto flex max-w-6xl flex-col gap-12 px-4 py-16 lg:flex-row lg:items-center lg:py-24">
        {/* Linker kolom */}
        <div className="flex-1 space-y-8">
          <div className="space-y-4">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-purple-500">
              AI domein &amp; bedrijfsnamen
            </p>

            <h1 className="text-3xl font-extrabold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
              Genereer Jouw Bedrijfs-
              <br />
              En Domeinnaam <span className="text-purple-600">Met AI</span>
            </h1>

            <p className="max-w-xl text-base text-slate-600 sm:text-lg">
              Jij hebt een idee. Wij zorgen voor de naam en het domein.
              Lanceer je website vandaag nog!
            </p>
          </div>

          {/* CTA knoppen */}
          <div className="flex flex-wrap items-center gap-4">
            <Link
              href={`/${lang}/tools/domain-generator/generator`}
              className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#5b21ff] to-[#a855f7] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-purple-400/40 transition hover:brightness-110"
            >
              <Sparkles className="h-4 w-4" />
              Genereer namen
            </Link>

            <a
              href="#hoe-werkt-het"
              className="inline-flex items-center gap-2 rounded-full border border-purple-300 bg-white/60 px-6 py-3 text-sm font-semibold text-purple-600 shadow-sm transition hover:bg-white"
            >
              Hoe werkt het?
            </a>
          </div>

          {/* Partners */}
          <div className="space-y-3 pt-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-slate-500">
              Onze partners
            </p>
            <div className="flex flex-wrap items-center gap-6 opacity-70">
              {/* Vervang deze divs door echte logo's als je ze hebt */}
              <div className="h-6 w-16 rounded-sm bg-slate-300/70" />
              <div className="h-6 w-20 rounded-sm bg-slate-300/70" />
              <div className="h-6 w-16 rounded-sm bg-slate-300/70" />
              <div className="h-6 w-16 rounded-sm bg-slate-300/70" />
              <div className="h-6 w-10 rounded-sm bg-slate-300/70" />
            </div>
          </div>
        </div>

        {/* Rechter kolom: foto + floating badges */}
        <div className="relative flex-1">
          <div className="relative mx-auto max-w-md">
            <div className="overflow-hidden rounded-3xl bg-slate-900/10 shadow-xl shadow-slate-900/20">
              <Image
                src="/images/hero-person.jpg" // <- vervang met jouw echte afbeelding
                alt="Ondernemer die werkt aan zijn merknaam"
                width={640}
                height={640}
                className="h-full w-full object-cover"
              />
            </div>

            {/* Badge: Nieuw in 2025 */}
            <div className="absolute -left-6 top-8 w-52 -rotate-6">
              <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-semibold text-slate-800 shadow-lg shadow-slate-900/10">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Zap className="h-4 w-4" />
                </span>
                <span>Nieuw in 2025</span>
              </div>
            </div>

            {/* Badge: Powered by GPT-5 Turbo */}
            <div className="absolute -bottom-6 right-0 w-60 rotate-3">
              <div className="flex items-center gap-2 rounded-2xl bg-white px-4 py-3 text-xs font-semibold text-slate-800 shadow-lg shadow-slate-900/10">
                <span className="flex h-7 w-7 items-center justify-center rounded-full bg-purple-100 text-purple-600">
                  <Cpu className="h-4 w-4" />
                </span>
                <span>Powered by GPT-5 Turbo</span>
              </div>
            </div>
          </div>

          {/* Soft glow achter de kaart */}
          <div className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-purple-300/40 blur-3xl" />
        </div>
      </div>
    </section>
  );
}
