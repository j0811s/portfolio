// @vitest-environment node
import { describe, expect, it, vi } from 'vitest';

const { fetchAllBlogId } = vi.hoisted(() => ({ fetchAllBlogId: vi.fn() }));

vi.mock('@/src/libs/microcms/blog', () => ({ fetchAllBlogId, fetchBlogDetail: vi.fn() }));
// 描画に使う部品とルートの metadata（layout.tsx は next/font を読み込みテストでは動かない）は対象外なので空にする
vi.mock('@/src/app/layout', () => ({ metadata: {} }));
vi.mock('@/src/features/blog', () => ({ ArticleDetail: () => null, AsideMenu: () => null }));
vi.mock('@/src/components', () => ({ Breadcrumb: () => null, JsonLd: () => null }));

import { generateStaticParams } from '@/src/app/(login)/blog/[postId]/page';

describe('記事詳細の generateStaticParams', () => {
  it('全記事の ID から params を作る', async () => {
    fetchAllBlogId.mockResolvedValue(['a', 'b']);

    await expect(generateStaticParams()).resolves.toEqual([{ postId: 'a' }, { postId: 'b' }]);
  });

  it('ID の取得に失敗したら、0 件にせずエラーを投げる（ビルドを失敗させる）', async () => {
    const error = new Error('microCMS down');
    fetchAllBlogId.mockRejectedValue(error);

    await expect(generateStaticParams()).rejects.toBe(error);
  });
});
