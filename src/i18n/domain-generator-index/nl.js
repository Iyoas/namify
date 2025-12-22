const messages = {
  domainGeneratorIndex: {
    hero: {
      titleLine1: "Genereer Jouw Bedrijfs-",
      titleLine2: "En Domeinnaam",
      titleAccent: "Met AI",
      subtitle:
        "Jij hebt een idee. Wij zorgen voor de naam en het domein. Lanceer je website vandaag nog!",
      primaryCta: "Genereer namen",
      secondaryCta: "Hoe werkt het?",
      partnersLabel: "Onze partners",
      badgeTop: "Nieuw in 2025",
      badgeBottom: "Powered by GPT-5 Turbo",
      imageAlt: "Ondernemer die werkt aan zijn merknaam",
    },
    howItWorks: {
      title: "Hoe werkt het stap voor stap?",
      subtitle:
        "Ontdek hoe je in 3 eenvoudige stappen met AI de perfecte domeinnaam vindt die bij jouw idee past.",
      steps: [
        {
          id: 1,
          title: "Deel je idee",
          description:
            "Kies hoe je jouw idee wilt delen: met een korte beschrijving, een businessplan of een link. De AI haalt zelf de juiste info eruit.",
        },
        {
          id: 2,
          title: "Kies de toon van je naam",
          description:
            "Kies de stijl die bij je past: kort en krachtig, creatief en uniek, zakelijk of speels. Jij bepaalt de richting, de AI denkt mee.",
        },
        {
          id: 3,
          title: "Ontvang slimme AI-voorstellen",
          description:
            "Op basis van je input krijg je direct creatieve naamideeën met beschikbare domeinen (.nl, .com). Je kunt filteren, sorteren en zoveel nieuwe ideeën genereren als je wilt.",
        },
        {
          id: 4,
          title: "Registreer met één klik",
          description:
            "Heb je de juiste naam gevonden? Klik op ‘registreer’. Alles wordt geregeld en binnen enkele minuten staat de domeinnaam op jouw naam. Daarna kun je direct verder bouwen.",
        },
      ],
    },
    howWeUseTool: {
      titleLine1: "Over ons gereedschap",
      titleLine2: "en hoe we het gebruiken",
      description:
        "Onze AI‑technologie is ontworpen om complexe informatie op een eenvoudige en begrijpelijke manier te verwerken. Door geavanceerde taalmodellen te combineren met slimme algoritmes, kunnen we patronen herkennen, ideeën uitbreiden en waardevolle inzichten genereren. Dit stelt ons in staat om snel nauwkeurige suggesties te leveren die passen bij jouw stijl, industrie en doelen. Met zorgvuldige training en voortdurend leren wordt ons systeem elke dag beter in het begrijpen van wat gebruikers écht nodig hebben. Zo helpen we je om efficiënter te werken en betere resultaten te behalen.",
      imageAlt: "AI gereedschap visual",
    },
    industryGenerators: {
      title: "ideeën voor branche specifieke namen",
      intro:
        "Ontdek unieke naamideeën die perfect aansluiten bij de identiteit, waarden en doelgroep van jouw branche – van frisse startups tot gevestigde merken.",
      cards: [
        { id: "ecommerce", title: "E-commerce", description: "Ontdek originele webshopnamen." },
        { id: "startup", title: "Start-up", description: "Ontdek originele namen voor startups." },
        { id: "marketing", title: "Marketing", description: "Ontdek namen die je merk laten opvallen." },
        { id: "creativeStudios", title: "Creatieve studio’s", description: "Ontdek originele namen voor creatieve studio’s." },
        { id: "saasApps", title: "SaaS & apps", description: "Ontdek namen voor innovatieve software en apps." },
        { id: "restaurants", title: "Restaurants", description: "Ontdek smaakvolle namen voor horecaconcepten." },
      ],
      cardCta: "Genereer namen",
    },
    contact: {
      title: "Neem contact op",
      subtitle: "Heb je vragen of wil je samenwerken? Ons team reageert meestal binnen 24 uur.",
      imageAlt: "Supportmedewerker die een klant helpt via de chat",
      form: {
        fullNameLabel: "Volledige naam",
        fullNamePlaceholder: "Jan Janssen",
        emailLabel: "E-mailadres",
        emailPlaceholder: "jan@email.com",
        messageLabel: "Bericht",
        messagePlaceholder: "Vertel kort waar we je mee kunnen helpen...",
        submit: "Bericht verzenden",
      },
      details: {
        emailLabel: "Email",
        emailValue: "info-namitor@gmail.com",
        locationLabel: "Location",
        locationValue: "Based in Rotterdam, The Netherlands",
      },
    },
    faq: {
      kicker: "Veelgestelde vragen",
      title: "Alles wat je moet weten, helder uitgelegd.",
      illustrationAlt: "FAQ illustratie",
      items: [
        {
          id: 1,
          question: "Hoe werkt de AI-bedrijfsnaam en domeinnaam generator precies?",
          answer:
            "Je vult een korte beschrijving van je idee in, kiest eventueel een niche en tone of voice, en onze AI genereert in een paar seconden een lijst met naam- en domeinvoorstellen. Je kunt resultaten verfijnen, opslaan als favoriet en nieuwe rondes genereren totdat je de perfecte match vindt.",
        },
        {
          id: 2,
          question: "Is Domifai gratis te gebruiken?",
          answer:
            "Je kunt de generator gratis proberen voor een beperkt aantal queries per dag. Voor intensiever gebruik, extra filters, het opslaan van favorieten en exportmogelijkheden kun je upgraden naar een betaalde bundel. Zo betaal je alleen voor wat je echt nodig hebt.",
        },
        {
          id: 3,
          question: "Zoek jullie tool ook meteen beschikbare domeinnamen?",
          answer:
            "Ja. Bij elk voorstel controleren we automatisch of het bijbehorende domein nog beschikbaar is bij populaire extensies, zoals .nl, .com en .io. Zo zie je in één oogopslag welke combinaties je direct kunt registreren bij onze partners.",
        },
        {
          id: 4,
          question: "Kan ik de gegenereerde namen later opnieuw bekijken?",
          answer:
            "Absoluut. In je favorieten-overzicht kun je eerdere sessies terugvinden, namen vergelijken en notities toevoegen. Dit is handig als je met een team keuzes wilt maken of varianten wilt testen voordat je definitief een domein vastlegt.",
        },
        {
          id: 5,
          question: "Ondersteunen jullie ook andere talen dan Nederlands?",
          answer:
            "Ja, Domifai is gebouwd met meertaligheid in gedachten. We starten met Nederlands en Engels, maar voegen stapsgewijs meer talen toe. Zo kun je straks eenvoudig namen genereren voor internationale merken of projecten.",
        },
        {
          id: 6,
          question: "Wat gebeurt er met de gegevens die ik invoer?",
          answer:
            "We gebruiken je input alleen om goede suggesties te doen binnen je sessie. Je tekst wordt niet gedeeld met derden en we slaan geen gevoelige data op zonder toestemming. In onze privacyverklaring lees je precies hoe we met gegevens omgaan.",
        },
      ],
    },
  },
};

export default messages;
