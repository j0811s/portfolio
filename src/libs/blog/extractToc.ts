type TocItem = {
  id: string;
  text: string;
  level: number;
};

type Options = {
  minLevel?: number;
  maxLevel?: number;
};

export function extractTocFromHtml(
  html: string,
  { minLevel = 2, maxLevel = 3 }: Options = {}
): TocItem[] {
  if (!html) return [];

  const headingRegex = /<h([1-6])[^>]*id="([^"]+)"[^>]*>([\s\S]*?)<\/h\1>/gi;

  const toc: TocItem[] = [];

  let match: RegExpExecArray | null;

  while ((match = headingRegex.exec(html))) {
    const level = Number(match[1]);
    const id = match[2];

    // タグを除去（a, strong など）
    const text = match[3].replace(/<[^>]+>/g, '').trim();

    if (
      level >= minLevel &&
      level <= maxLevel &&
      id &&
      text
    ) {
      toc.push({ id, text, level });
    }
  }

  return toc;
}
