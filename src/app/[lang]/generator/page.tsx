interface GeneratorPageProps {
    params: { lang: string }
  }
  
  export default function GeneratorPage({ params }: GeneratorPageProps) {
    const { lang } = params
  
    return (
      <main className="p-6">
        <h1 className="text-2xl font-bold mb-2">AI Domein- en Bedrijfsnaam generator</h1>
        <p className="text-gray-600 mb-4">
          Taal: <strong>{lang}</strong>
        </p>
        <p>Hier komt straks het formulier om feesten en feesten te genereren.</p>
      </main>
    )
  }
  