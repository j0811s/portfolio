// @vitest-environment node
import { afterAll, afterEach, beforeAll, describe, expect, it, vi } from 'vitest';
import { createMicroCMSError } from '../../helpers/microcms';

// unstable_cache は Next.js のサーバー外では動かない（incrementalCache が無い）ため、
// 渡された関数をそのまま返し、キャッシュの設定（キー・有効期間）だけを記録する
const { unstable_cache, notFound } = vi.hoisted(() => ({
  unstable_cache: vi.fn(
    (fn: (...args: unknown[]) => unknown, _keyParts?: string[], _options?: unknown) => fn
  ),
  notFound: vi.fn(),
}));
vi.mock('next/cache', () => ({ unstable_cache }));
vi.mock('next/navigation', async (importOriginal) => ({
  ...(await importOriginal<typeof import('next/navigation')>()),
  notFound,
}));

let blog: typeof import('@/src/libs/microcms/blog');
/** 読み込み時に unstable_cache へ渡された引数（テストの開始時には呼び出し履歴が消えているため、読み込み直後に控える） */
let cacheArgs: unknown[] | undefined;

beforeAll(async () => {
  // blog.ts は読み込み時に環境変数を確認するため、読み込む前に設定する
  vi.stubEnv('MICROCMS_SERVICE_DOMAIN', 'example');
  vi.stubEnv('MICROCMS_API_KEY', 'key');
  blog = await import('@/src/libs/microcms/blog');
  cacheArgs = unstable_cache.mock.calls.find(([, keyParts]) =>
    keyParts?.includes('microcms-blog-summary-all')
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
  vi.restoreAllMocks();
});

afterAll(() => {
  vi.unstubAllEnvs();
});

describe('fetchBlogSummaryAll', () => {
  it('ページの ISR と同じ 1 時間でキャッシュする', () => {
    expect(cacheArgs).toEqual([
      expect.any(Function),
      ['microcms-blog-summary-all'],
      { revalidate: 3600 },
    ]);
  });

  it('全記事の id・カテゴリ・タグ・公開日だけを取得する', async () => {
    const posts = [{ id: 'a' }, { id: 'b' }];
    const getAllContents = vi
      .spyOn(blog.client, 'getAllContents')
      .mockResolvedValue(posts as never);

    await expect(blog.fetchBlogSummaryAll()).resolves.toBe(posts);
    expect(getAllContents).toHaveBeenCalledWith({
      endpoint: 'blog',
      queries: { fields: 'id,category,tag,publishedAt' },
    });
  });

  it.each([{ status: 503 } as const, { status: 429 } as const, 'network-error' as const])(
    'microCMS の取得に失敗したら（%o）空の一覧にせず投げ直す',
    async (response) => {
      const error = await createMicroCMSError(response);
      vi.spyOn(blog.client, 'getAllContents').mockRejectedValue(error);

      await expect(blog.fetchBlogSummaryAll()).rejects.toBe(error);
    }
  );

  it.each([400, 404])(
    'microCMS が %i を返しても notFound() にせず投げ直す（サイドメニューのある全ページが 404 にならないように）',
    async (status) => {
      const error = await createMicroCMSError({ status });
      vi.spyOn(blog.client, 'getAllContents').mockRejectedValue(error);

      await expect(blog.fetchBlogSummaryAll()).rejects.toBe(error);
      expect(notFound).not.toHaveBeenCalled();
    }
  );
});

describe('fetchAllBlogId', () => {
  it('全記事の ID を返す', async () => {
    const getAllContentIds = vi
      .spyOn(blog.client, 'getAllContentIds')
      .mockResolvedValue(['a', 'b']);

    await expect(blog.fetchAllBlogId('blog')).resolves.toEqual(['a', 'b']);
    expect(getAllContentIds).toHaveBeenCalledWith({ endpoint: 'blog' });
  });

  it.each([
    { status: 400 } as const,
    { status: 404 } as const,
    { status: 503 } as const,
    'network-error' as const,
  ])('取得に失敗したら（%o）握りつぶさず、notFound() にもせず投げ直す', async (response) => {
    const error = await createMicroCMSError(response);
    vi.spyOn(blog.client, 'getAllContentIds').mockRejectedValue(error);
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    await expect(blog.fetchAllBlogId('blog')).rejects.toBe(error);
    expect(notFound).not.toHaveBeenCalled();
    expect(consoleError).not.toHaveBeenCalled();
  });
});
