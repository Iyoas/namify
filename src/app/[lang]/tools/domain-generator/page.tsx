import Link from "next/link";

// Define the Lang type and export it
export type Lang = "en" | "nl" | "fr"; // Add other languages as needed

export function domainGeneratorGenerator(lang: string): string {
  return `/generate-domain/${lang}`;
}

export default function DomainGeneratorLanding({
  params,
}: {
  params: { lang: Lang };
}) {
  const { lang } = params;

  return (
    <section>
      <h1 className="text-3xl font-bold mb-4">
        Genereer jouw bedrijfs- en domeinnaam met AI
      </h1>

      <Link
        href={domainGeneratorGenerator(lang)}
        className="inline-flex px-4 py-2 rounded-full bg-purple-600 text-white text-sm font-medium"
      >
        Start met genereren
      </Link>
    </section>
  );
}
