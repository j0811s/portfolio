// 検索対象はタイトルと本文のみ（いずれも filters の contains が使えるテキスト・リッチエディタ）
const SEARCH_FIELDS = ['title', 'content'] as const;

// microCMS の filters は値のエスケープができない仕様のため、
// 条件式の区切り（`[and]` 等）や優先順位の括弧として解釈される文字は検索語から除く
const FILTER_SYNTAX_CHARS = /[[\]()]/g;

// /api/blog は未認証でも呼べるため、microCMS へ送る条件の長さと数に上限を設ける
export const MAX_KEYWORD_LENGTH = 100;
export const MAX_SEARCH_TERMS = 5;

/**
 * 検索キーワードから microCMS の filters 文字列を組み立てる。
 *
 * `q`（全文検索）は `Next React` のような空白区切りの複数語で 0 件になるため、
 * `contains` による部分一致で検索する。空白区切りの複数語は AND 条件、
 * 各語はタイトル・本文のいずれかに含まれれば一致とする。
 * 実 API での確認では、本文の HTML タグ・属性名には一致しない。大文字・小文字は区別される。
 *
 * キーワードは先頭 {@link MAX_KEYWORD_LENGTH} 文字のみを使い、
 * 重複を除いた先頭 {@link MAX_SEARCH_TERMS} 語までを条件にする。
 *
 * @param keyword - ユーザーが入力した検索キーワード
 * @returns filters 文字列。有効な検索語が無い場合は `undefined`
 */
export const buildSearchFilters = (keyword: string): string | undefined => {
  const terms = [
    ...new Set(
      keyword
        .slice(0, MAX_KEYWORD_LENGTH)
        .replace(FILTER_SYNTAX_CHARS, ' ')
        .split(/\s+/)
        .filter((term) => term !== '')
    ),
  ].slice(0, MAX_SEARCH_TERMS);

  if (terms.length === 0) {
    return undefined;
  }

  return terms
    .map((term) => `(${SEARCH_FIELDS.map((field) => `${field}[contains]${term}`).join('[or]')})`)
    .join('[and]');
};
