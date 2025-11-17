// src/app/[lang]/tools/domain-generator/register-domain/page.tsx
import type { Lang } from "@/config/i18n";

export default function RegisterDomainPage({
  params,
}: {
  params: { lang: Lang };
}) {
  const { lang } = params;

  return (
    <section>
      <h1 className="text-2xl font-bold mb-3">Register domain – lang: {lang}</h1>
      <p className="text-slate-300">
        Hier kun je later een flow maken naar een domain registrar of affiliate
        (TransIP, Namecheap, Cloudflare, etc.).
      </p>
    </section>
  );
}
