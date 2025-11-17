// src/app/[lang]/tools/domain-generator/niches/[slug]/page.tsx

type NichePageProps = {
    params: {
      lang: string;
      slug: string;
    };
  };
  
  export default function NichePage({ params }: NichePageProps) {
    const { lang, slug } = params;
  
    return (
      <main style={{ padding: "2rem" }}>
        <h1>Programmatic niche page</h1>
        <pre>{JSON.stringify(params, null, 2)}</pre>
        <p>
          <strong>Slug:</strong> {slug}
        </p>
  
        <p>
          <strong>Taal (lang):</strong> {lang}
        </p>
  
        <hr />
  
        <p>
          Dit is de pagina voor niche <code>{slug}</code> in taal{" "}
          <code>{lang}</code>. Hier kun je later je SEO-tekst en generator voor
          deze niche tonen.
        </p>
      </main>
    );
  }
  