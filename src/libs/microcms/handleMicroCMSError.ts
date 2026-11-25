import { notFound, unstable_rethrow } from 'next/navigation';
import { isMicroCMSRequestError } from 'microcms-js-sdk';

// 404 として扱うステータス。存在しない ID や不正なパラメータなど、再試行しても結果が変わらないものに限る
const NOT_FOUND_STATUSES = new Set([400, 404]);

/**
 * ログ用に、リクエスト先をパスとクエリのパラメータ名だけで表す（値は含めない）。
 *
 * @param url - SDK のエラーが持つリクエスト URL
 * @returns 例: `/api/v1/blog?filters,limit`
 */
const describeRequest = (url: string): string => {
  try {
    const { pathname, searchParams } = new URL(url);
    const names = [...new Set(searchParams.keys())];
    return names.length > 0 ? `${pathname}?${names.join(',')}` : pathname;
  } catch {
    return '(unknown url)';
  }
};

/**
 * microCMS の取得関数の catch 節で使うエラー処理。
 * microCMS が 400 / 404 を返したときだけ `notFound()` にし、それ以外は投げ直す。
 *
 * 一時的な障害（5xx・429・ネットワークエラー）まで `notFound()` にすると、ISR の再生成時に
 * 404 が正常な結果としてキャッシュされてしまう。投げ直せば再生成は失敗扱いになり、前回のページが出続ける。
 *
 * TypeScript が呼び出し後を到達不能と判断できるよう関数宣言にしている
 * （型注釈のない `const` のアロー関数では `never` による制御フロー解析が効かない）。
 *
 * @param error - catch 節で受け取った値
 */
export function handleMicroCMSError(error: unknown): never {
  unstable_rethrow(error);

  if (
    isMicroCMSRequestError(error) &&
    error.status !== undefined &&
    NOT_FOUND_STATUSES.has(error.status)
  ) {
    // 400 はコード側の fields / filters の誤りでも返るため、404 にする前に原因を追えるよう記録する。
    // filters には検索語が入るので、クエリは値を出さずパラメータ名だけを記録する
    if (error.status === 400) {
      console.warn(`microCMS returned 400: ${describeRequest(error.url)}`);
    }
    notFound();
  }

  throw error;
}
