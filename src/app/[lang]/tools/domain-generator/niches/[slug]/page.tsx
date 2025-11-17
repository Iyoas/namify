export default function Page({
    params,
  }: {
    params: { lang: string; slug: string };
  }) {
    const { lang, slug } = params;
  
    return (
      <div>
        <h1>Programmatic niche page – {slug}</h1>
        <p>Lang: {lang}</p>
      </div>
    );
  }
  