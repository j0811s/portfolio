import { vi } from 'vitest';
import { createClient } from 'microcms-js-sdk';
import { notFound } from 'next/navigation';

/**
 * microCMS の SDK に fetch の結果を処理させ、SDK が実際に投げるエラーオブジェクト（status・url を持つ）を得る。
 * fetch はグローバルを差し替えるので、呼び出し側の afterEach で `vi.unstubAllGlobals()` を呼ぶ。
 *
 * @param response - fetch が返すレスポンス（`'network-error'` なら fetch 自体を失敗させる）
 * @param queries - リクエストのクエリ（ログに漏れないかの検証用）
 */
export const createMicroCMSError = async (
  response: { status: number } | 'network-error',
  queries: Record<string, string> = {}
): Promise<unknown> => {
  vi.stubGlobal(
    'fetch',
    vi.fn(async () => {
      if (response === 'network-error') {
        throw new TypeError('fetch failed');
      }
      return new Response(JSON.stringify({ message: 'error' }), { status: response.status });
    })
  );
  const client = createClient({ serviceDomain: 'example', apiKey: 'key', retry: false });
  return client.getList({ endpoint: 'blog', queries }).then(
    () => {
      throw new Error('リクエストが成功してしまった');
    },
    (error: unknown) => error
  );
};

/** 本物の notFound() が投げるエラー（取得関数が microCMS の 400 / 404 を変換して投げるもの） */
export const createNotFoundError = (): unknown => {
  try {
    notFound();
  } catch (error) {
    return error;
  }
  throw new Error('notFound() が例外を投げなかった');
};
