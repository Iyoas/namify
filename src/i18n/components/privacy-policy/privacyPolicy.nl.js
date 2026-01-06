export const privacyPolicyNl = {
  title: "Privacyverklaring",
  intro: [
    "Deze privacyverklaring legt uit hoe wij persoonsgegevens verwerken wanneer u onze website en bijbehorende functies bezoekt of gebruikt.",
    "Deze verklaring geldt voor alle gebruikers van de site en de domeinnaamgenerator en -checker.",
  ],
  sections: {
    dataCollection: {
      title: "Welke gegevens wij verzamelen",
      paragraphs: [
        "Wanneer u de site bezoekt of de functies gebruikt, verwerken wij standaard verzoekgegevens zoals IP-adres, user agent/apparaatinformatie, request headers en URL-parameters.",
        "Wij lezen een landcode die uit het IP-adres wordt afgeleid (via hosting-headers) om de standaardtaal te bepalen.",
        "Wanneer u de generator of checker gebruikt, verwerken wij door u ingevoerde content zoals prompts, basisnamen, domeinnamen en geselecteerde opties (taal, stijl, voorkeurs- of geselecteerde TLD's).",
        "Als u favorieten opslaat, worden gelikete namen opgeslagen in de localStorage van uw browser op uw apparaat totdat u ze verwijdert.",
        "De applicatie produceert ook operationele serverlogs die gegenereerde namen, resultaten van domeinbeschikbaarheid en foutdetails kunnen bevatten.",
      ],
    },
    howWeUse: {
      title: "Hoe wij gegevens gebruiken",
      paragraphs: [
        "Verzoekmetadata wordt gebruikt om de site te leveren, verzoeken te routeren en de juiste taal toe te passen.",
        "Uw input en geselecteerde opties gebruiken wij om naamsuggesties te genereren, prompts te verbeteren en domeinbeschikbaarheid te controleren.",
        "LocalStorage wordt uitsluitend gebruikt om gelikete namen op uw apparaat te onthouden.",
        "Afgezien van localStorage en operationele logging slaan wij uw input niet op in onze eigen database; prompts en domeinqueries worden per verzoek verwerkt en in de respons teruggegeven.",
      ],
    },
    dataSharing: {
      title: "Delen van gegevens met derden",
      paragraphs: [
        "Voor kernfunctionaliteit sturen wij prompts en gerelateerde opties naar OpenAI voor tekstgeneratie.",
        "Voor het controleren van domeinbeschikbaarheid sturen wij domeinnamen naar de API van GoDaddy, met fallback naar de Domainr/Fastly API indien nodig.",
        "Wanneer u op een registratielink klikt, wordt uw browser doorgestuurd naar GoDaddy met het geselecteerde domein in de URL.",
        "Verder delen wij geen persoonsgegevens met derden.",
      ],
    },
    retention: {
      title: "Opslag en bewaartermijnen",
      paragraphs: [
        "Gelikete namen in localStorage blijven op uw apparaat staan totdat u ze verwijdert.",
        "Prompts en domeinqueries worden per verzoek verwerkt en niet opgeslagen in onze eigen database.",
        "Operationele serverlogs kunnen gegenereerde namen, resultaten van domeinbeschikbaarheid en foutdetails bevatten.",
      ],
    },
    rights: {
      title: "Uw rechten onder de AVG",
      paragraphs: [
        "U heeft het recht op inzage, rectificatie, verwijdering, beperking van verwerking, overdraagbaarheid van gegevens en bezwaar tegen verwerking.",
        "Wanneer verwerking is gebaseerd op toestemming, kunt u uw toestemming op elk moment intrekken.",
        "U heeft ook het recht om een klacht in te dienen bij uw toezichthoudende autoriteit.",
      ],
    },
    contact: {
      title: "Contact",
      paragraphs: [
        "Voor privacyvragen of verzoeken kunt u contact opnemen via contact@domifai.com.",
      ],
    },
  },
};
