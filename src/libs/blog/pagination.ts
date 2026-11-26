import { LIMIT } from '@/src/constants/blog';

/**
 * 記事数から一覧のページ数を求める。記事が 0 件でも 1 ページ目（「記事がありません」の表示）はあるので 1 を返す。
 */
export const countPages = (totalCount: number, limit: number = LIMIT): number =>
  Math.max(1, Math.ceil(totalCount / limit));

/**
 * `generateStaticParams` 用に、1 から記事数に応じたページ数までのページ番号を文字列で返す。
 */
export const pageNumbers = (totalCount: number, limit: number = LIMIT): string[] =>
  Array.from({ length: countPages(totalCount, limit) }, (_, i) => String(i + 1));

/**
 * URL のページ番号を数値にする。1 以上の整数の表記でなければ undefined（`0`・`01`・`1.5`・`abc` など）。
 * microCMS へ不正な offset を送らないよう、取得の前に使う。
 */
export const parsePageNumber = (num: string): number | undefined =>
  /^[1-9]\d*$/.test(num) ? Number(num) : undefined;

/**
 * ページ番号が、記事数から見て存在するページかを判定する（ビルド後に記事が減った場合や、URL の直接入力のため）。
 */
export const isPageInRange = (page: number, totalCount: number, limit: number = LIMIT): boolean =>
  page <= countPages(totalCount, limit);
