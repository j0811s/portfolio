/**
 * 公開年ごとの記事数を数える（公開日の無い記事は数えない）。
 * サイドメニューの年別アーカイブと、年別一覧のページ数の計算で共有する。
 */
export const countPostsByYear = (contents: Pick<Blog, 'publishedAt'>[]): Record<string, number> => {
  const counts: Record<string, number> = {};
  for (const post of contents) {
    const year = post.publishedAt?.slice(0, 4);
    if (year) counts[year] = (counts[year] ?? 0) + 1;
  }
  return counts;
};

/** URL の年が 4 桁の数字か（`20` のような部分一致で全記事に一致する値を microCMS に送らないため） */
export const isValidYear = (year: string): boolean => /^\d{4}$/.test(year);
