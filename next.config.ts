/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // NL: mooie slugs
      {
        source: "/nl/tools/domeinnaam-generator",
        destination: "/nl/tools/domain-generator",
      },
      {
        source: "/nl/tools/domeinnaam-checker",
        destination: "/nl/tools/domain-checker",
      },
      {
        source: "/nl/privacybeleid",
        destination: "/nl/tools/domain-generator/privacy-policy",
      },
      {
        source: "/nl/gelikete-namen",
        destination: "/nl/tools/domain-generator/liked-names",
      },

      // ES: generador de dominios
      {
        source: "/es/herramientas/generador-de-dominios",
        destination: "/es/tools/domain-generator",
      },
      {
        source: "/es/herramientas/generador-de-dominios/:path*",
        destination: "/es/tools/domain-generator/:path*",
      },

      // EN: slugs = canoniek, geen rewrite nodig
      {
        source: "/en/privacy-policy",
        destination: "/en/tools/domain-generator/privacy-policy",
      },
      {
        source: "/en/liked-names",
        destination: "/en/tools/domain-generator/liked-names",
      },
    ];
  },
  async redirects() {
    return [
      // EN: generator without /generator
      {
        source: "/en/tools/domain-generator/generator",
        destination: "/en/tools/domain-generator",
        permanent: true,
      },
      // NL: redirect oude Engelse slugs
      {
        source: "/nl/tools/domain-generator",
        destination: "/nl/tools/domeinnaam-generator",
        permanent: true,
      },
      {
        source: "/nl/tools/domain-generator/generator",
        destination: "/nl/tools/domeinnaam-generator",
        permanent: true,
      },
      {
        source: "/nl/tools/domain-checker",
        destination: "/nl/tools/domeinnaam-checker",
        permanent: true,
      },
      {
        source: "/nl/tools/domain-generator/privacy-policy",
        destination: "/nl/privacybeleid",
        permanent: true,
      },
      {
        source: "/nl/tools/domain-generator/liked-names",
        destination: "/nl/gelikete-namen",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
