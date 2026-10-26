// 検索対象のフィールド（microCMS の filters で contains を使えるテキスト・リッチエディタ）
const SEARCH_FIELDS = ['title', 'content'] as const;

// microCMS の filters は値のエスケープができない仕様のため、
// 条件式の区切り（`[and]` 等）や優先順位の括弧として解釈される文字は検索語から除く
const FILTER_SYNTAX_CHARS = /[[\]()]/g;

/**
 * 検索キーワードから microCMS の filters 文字列を組み立てる。
 *
 * `q`（形態素解析による全文検索）は語の区切りと一致しない部分文字列ではヒットしないため、
 * `contains` による部分一致で検索する。空白区切りの複数語は AND 条件、
 * 各語はいずれかの検索対象フィールドに含まれれば一致とする。
 *
 * @param keyword - ユーザーが入力した検索キーワード
 * @returns filters 文字列。有効な検索語が無い場合は `undefined`
 */
export const buildSearchFilters = (keyword: string): string | undefined => {
  const terms = keyword
    .replace(FILTER_SYNTAX_CHARS, ' ')
    .split(/\s+/)
    .filter((term) => term !== '');

  if (terms.length === 0) {
    return undefined;
  }

  return terms
    .map((term) => `(${SEARCH_FIELDS.map((field) => `${field}[contains]${term}`).join('[or]')})`)
    .join('[and]');
};
