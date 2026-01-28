// src/app/[lang]/tools/domain-generator/page.tsx
import DomainGeneratorPage from "./generator/page";

type DomainGeneratorPageProps = {
  params: Promise<{
    lang: string;
  }>;
};

export default DomainGeneratorPage;
