/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      // NL: bedrijfsnaam generator
      {
        source: "/nl/tools/bedrijfsnaam-generator",
        destination: "/nl/tools/domain-generator",
      },
      {
        source: "/nl/tools/bedrijfsnaam-generator/:path*",
        destination: "/nl/tools/domain-generator/:path*",
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
    ];
  },
};

export default nextConfig;
