export const privacyPolicyEn = {
  title: "Privacy Policy",
  intro: [
    "This Privacy Policy explains how we process personal data when you visit or use our website and related features.",
    "It applies to all users of the site and the domain name generator and checker.",
  ],
  sections: {
    dataCollection: {
      title: "What data we collect",
      paragraphs: [
        "When you visit the site or use its features, we process standard request data such as IP address, user agent/device information, request headers, and URL parameters.",
        "We read a country code derived from the IP address (via hosting headers) to determine the default language.",
        "When you use the generator or checker, we process submitted content such as prompts, base names, domain names, and selected options (language, style, preferred or selected TLDs).",
        "If you save favorites, liked names are stored in your browser's localStorage on your device until you remove them.",
        "The application also produces operational server logs that may include generated names, domain availability results, and error details.",
      ],
    },
    howWeUse: {
      title: "How we use data",
      paragraphs: [
        "Request metadata is used to deliver the site, route requests, and apply the correct language.",
        "User input and selected options are used to generate name suggestions, enhance prompts, and check domain availability.",
        "LocalStorage is used solely to remember liked names on your device.",
        "Aside from localStorage and operational logging, we do not store user input in our own database; prompts and domain queries are processed per request and returned in the response.",
      ],
    },
    dataSharing: {
      title: "Data sharing with third parties",
      paragraphs: [
        "To provide core functionality, prompts and related options are sent to OpenAI for text generation.",
        "Domain availability checks send domain names to GoDaddy's API, with fallback to the Domainr/Fastly API if required.",
        "When you click a domain registration link, your browser is redirected to GoDaddy with the selected domain included in the URL.",
        "No other third-party data sharing occurs.",
      ],
    },
    retention: {
      title: "Data storage and retention",
      paragraphs: [
        "Liked names stored in localStorage remain on your device until you remove them.",
        "Prompts and domain queries are processed per request and are not stored in our own database.",
        "Operational server logs may contain generated names, domain availability results, and error details.",
      ],
    },
    rights: {
      title: "Your rights under the GDPR",
      paragraphs: [
        "You have the right to request access, rectification, erasure, restriction of processing, data portability, and to object to processing.",
        "Where processing is based on consent, you may withdraw your consent at any time.",
        "You also have the right to lodge a complaint with your supervisory authority.",
      ],
    },
    contact: {
      title: "Contact",
      paragraphs: [
        "For privacy questions or requests, you can contact us at contact@domifai.com.",
      ],
    },
  },
};
