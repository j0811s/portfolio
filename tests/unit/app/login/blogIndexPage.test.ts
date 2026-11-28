// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';

const { fetchBlogList, permanentRedirect, REDIRECT } = vi.hoisted(() => {
  const REDIRECT = new Error('permanentRedirect called');
  return {
    REDIRECT,
    fetchBlogList: vi.fn(async () => ({ contents: [], totalCount: 32 })),
    permanentRedirect: vi.fn(() => {
      throw REDIRECT;
    }),
  };
});

vi.mock('@/src/libs/microcms/blog', () => ({ fetchBlogList }));
vi.mock('next/navigation', () => ({ permanentRedirect }));
// 描画に使う部品とルートの metadata（layout.tsx は next/font を読み込みテストでは動かない）は対象外なので空にする
vi.mock('@/src/app/layout', () => ({ metadata: {} }));
vi.mock('@/src/features/blog', () => ({ AsideMenu: () => null, SearchExperience: () => null }));
vi.mock('@/src/components', () => ({ Breadcrumb: () => null }));

import * as blogIndex from '@/src/app/(login)/blog/page';
import RedirectPage from '@/src/app/(login)/blog/page/[num]/page';

const searchParams = (page?: string) => Promise.resolve(page === undefined ? {} : { page });

afterEach(() => {
  vi.clearAllMocks();
});

describe('/blog/ の ?page=', () => {
  it('正しいページ番号なら、そのページの offset で取得する', async () => {
    await blogIndex.default({ searchParams: searchParams('2') });

    expect(fetchBlogList).toHaveBeenCalledWith(
      'blog',
      expect.objectContaining({ limit: 12, offset: 12 })
    );
  });

  it.each([
    undefined,
    '',
    '0',
    '01',
    '1.5',
    '1e2',
    'abc',
    ' 2',
    '2 ',
    '+2',
    '100000000000000000000',
  ])('未指定・不正な値（%s）は 1 ページ目として offset 0 で取得する', async (page) => {
    await blogIndex.default({ searchParams: searchParams(page) });

    expect(fetchBlogList).toHaveBeenCalledWith('blog', expect.objectContaining({ offset: 0 }));
  });

  it('generateMetadata も同じ判定で、不正な値は 1 ページ目のタイトルと canonical にする', async () => {
    const valid = await blogIndex.generateMetadata({ searchParams: searchParams('2') });
    expect(valid.title).toBe('2ページ目 | 投稿');
    expect(valid.alternates?.canonical).toBe('/blog/?page=2');

    const invalid = await blogIndex.generateMetadata({ searchParams: searchParams('1e2') });
    expect(invalid.title).toBe('投稿');
    expect(invalid.alternates?.canonical).toBe('/blog/');
  });
});

describe('/blog/page/[num]/ の転送', () => {
  it.each([
    ['2', '/blog/?page=2'],
    ['1', '/blog/'],
    ['abc', '/blog/'],
    ['01', '/blog/'],
    ['1e2', '/blog/'],
  ])('%s は %s へ転送する', async (num, expected) => {
    await expect(RedirectPage({ params: Promise.resolve({ num }) })).rejects.toBe(REDIRECT);
    expect(permanentRedirect).toHaveBeenCalledWith(expected);
  });
});
