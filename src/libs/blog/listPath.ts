/** タグ・カテゴリー・年別アーカイブの一覧の種類（URL の `/blog/<slug>/` の部分） */
export type ListSlug = 'tags' | 'categories' | 'archive';

/**
 * タグ・カテゴリー・年別アーカイブの一覧の URL（パス）を作る。
 * パンくずリスト（JSON-LD を含む）と canonical の URL を手書きすると ID や年が抜けやすいため（#64）、ここで組み立てる。
 *
 * @param slug - 一覧の種類
 * @param id - タグ・カテゴリーの ID、または年
 * @param page - ページ番号。省略すると一覧の先頭（`/blog/<slug>/<id>/`）
 */
export const listPath = (slug: ListSlug, id: string, page?: number): string =>
  page === undefined ? `/blog/${slug}/${id}/` : `/blog/${slug}/${id}/page/${page}/`;

/**
 * `page/[num]` の canonical の URL。1 ページ目は一覧の先頭と同じ内容なので先頭を、2 ページ目以降は自身を指す。
 */
export const pagedListCanonical = (slug: ListSlug, id: string, page: number): string =>
  page === 1 ? listPath(slug, id) : listPath(slug, id, page);
