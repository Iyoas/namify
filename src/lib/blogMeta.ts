type PortableTextChild = {
  _type?: string;
  text?: string;
};

type PortableTextBlock = {
  _type?: string;
  children?: PortableTextChild[];
};

export function extractPlainTextFromPortableText(body: unknown[] | undefined): string {
  if (!Array.isArray(body)) return "";

  return body
    .flatMap((block) => {
      if (!block || typeof block !== "object") return [];
      const value = block as PortableTextBlock;
      if (!Array.isArray(value.children)) return [];

      return value.children
        .map((child) => (child?._type === "span" ? child.text ?? "" : ""))
        .filter(Boolean);
    })
    .join(" ")
    .replace(/\s+/g, " ")
    .trim();
}

export function countWords(text: string): number {
  const words = text.match(/\b[\p{L}\p{N}'’-]+\b/gu);
  return words?.length ?? 0;
}

export function estimateReadingTimeMinutes(wordCount: number, wordsPerMinute = 250): number {
  if (wordCount <= 0) return 1;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
}
