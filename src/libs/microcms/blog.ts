// https://blog.microcms.io/microcms-next15-jamstack-blog/
import { createClient } from 'microcms-js-sdk';
import { unstable_cache } from 'next/cache';
import { handleMicroCMSError } from './handleMicroCMSError';
import type { MicroCMSListResponse, MicroCMSQueries, CustomRequestInit } from 'microcms-js-sdk';

if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_SERVICE_DOMAIN is required');
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error('MICROCMS_API_KEY is required');
}

// API取得用のクライアントを作成
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
  retry: true,
});

// 投稿一覧を取得
export const fetchBlogList = async (
  endpoint: string = 'blog',
  queries?: MicroCMSQueries,
  customRequestInit?: CustomRequestInit
) => {
  let response: MicroCMSListResponse<Blog> | undefined;

  try {
    response = await client.getList<Blog>({
      endpoint,
      queries,
      customRequestInit,
    });
  } catch (error) {
    handleMicroCMSError(error);
  }

  return response;
};

// 投稿の詳細を取得
export const fetchBlogDetail = async (
  endpoint: string = 'blog',
  contentId: string,
  queries?: MicroCMSQueries,
  customRequestInit?: CustomRequestInit
) => {
  let response: Blog | undefined;

  try {
    response = await client.getListDetail<Blog>({
      endpoint,
      contentId,
      queries,
      customRequestInit,
    });
  } catch (error) {
    handleMicroCMSError(error);
  }

  return response;
};

/** `fetchBlogSummaryAll` が返す記事（集計に使う 4 項目だけ。ほかの項目は取得しない） */
export type BlogSummary = Pick<Blog, 'id' | 'category' | 'tag' | 'publishedAt'>;

/**
 * 全記事の id・カテゴリ・タグ・公開日だけを取得する（サイドメニューの集計と、一覧のページ数の計算に使う）。
 *
 * サイドメニュー（`AsideMenu`）は記事詳細・アーカイブ・カテゴリ・タグ別一覧のすべてのページで描画される。
 * React の `cache()` は 1 回のレンダリングの中でしか重複を除けないため、そのままではページの数だけ全件取得を
 * 繰り返し、ビルド中に microCMS のレート制限（429）に当たりうる（#72）。`unstable_cache` は結果を
 * Next.js のデータキャッシュに保存するので、ビルドの並列ワーカーやほかのページの再生成でも使い回せる。
 *
 * 有効期間はページの ISR（`revalidate = 3600`）に揃える。結果はデプロイをまたいで残るため、再デプロイの直後も
 * 最大で有効期間の分だけ古い集計になりうる。
 *
 * 失敗時の扱い:
 * - キャッシュが無いときは、失敗はキャッシュされずにそのまま投げられる（ビルドの失敗、またはエラー画面）
 * - 期限切れのキャッシュがあるときは、再取得に失敗しても Next.js が `console.error` に記録して古い集計を返す
 *
 * `handleMicroCMSError` は通さない。全件の集計は個別のページではないため、400 / 404（fields の誤りや
 * エンドポイントの設定ミス）を `notFound()` にすると、サイドメニューのある全ページが 404 になってしまう。
 */
export const fetchBlogSummaryAll = unstable_cache(
  async (): Promise<BlogSummary[]> =>
    client.getAllContents<BlogSummary>({
      endpoint: 'blog',
      queries: { fields: 'id,category,tag,publishedAt' },
    }),
  ['microcms-blog-summary-all'],
  { revalidate: 3600 }
);

// エンドポイントのコンテンツIDをすべて取得
export const fetchAllBlogId = async (endpoint: string = 'blog') => {
  const ids = await client.getAllContentIds({ endpoint }).catch((err) => console.error(err));

  return ids;
};
