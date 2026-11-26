// @vitest-environment node
import { afterEach, describe, expect, it, vi } from 'vitest';

const { mocks, NOT_FOUND } = vi.hoisted(() => {
  const NOT_FOUND = new Error('notFound called');
  return {
    NOT_FOUND,
    mocks: {
      getAllContents: vi.fn(),
      fetchBlogList: vi.fn(),
      fetchBlogDetail: vi.fn(),
      fetchBlogSummaryAll: vi.fn(),
      notFound: vi.fn(() => {
        throw NOT_FOUND;
      }),
    },
  };
});

vi.mock('@/src/libs/microcms/blog', () => ({
  client: { getAllContents: mocks.getAllContents },
  fetchBlogList: mocks.fetchBlogList,
  fetchBlogDetail: mocks.fetchBlogDetail,
  fetchBlogSummaryAll: mocks.fetchBlogSummaryAll,
}));
vi.mock('next/navigation', () => ({ notFound: mocks.notFound }));
// 一覧の描画はこのテストの対象外のため、受け取った props を返すだけにする
vi.mock('@/src/features/blog', () => ({ BlogListLayout: (props: unknown) => props }));

import * as tagsPage from '@/src/app/(login)/blog/tags/[tagId]/page/[num]/page';
import * as categoriesPage from '@/src/app/(login)/blog/categories/[catId]/page/[num]/page';
import * as archivePage from '@/src/app/(login)/blog/archive/[year]/page/[num]/page';
import * as archiveTopPage from '@/src/app/(login)/blog/archive/[year]/page';

const ref = (id: string) => ({ id, name: id, slug: id });

// 13 件: react・frontend・2024 が 13 件（2 ページ）、vue・other・2023 が 1 件（1 ページ）
const posts = [
  ...Array.from({ length: 12 }, (_, i) => ({
    id: `p${i}`,
    tag: [ref('react')],
    category: [ref('frontend')],
    publishedAt: '2024-05-01T00:00:00.000Z',
  })),
  {
    id: 'p12',
    tag: [ref('react'), ref('vue')],
    category: [ref('frontend'), ref('other')],
    publishedAt: '2024-06-01T00:00:00.000Z',
  },
  {
    id: 'p13',
    tag: [ref('vue')],
    category: [ref('other')],
    publishedAt: '2023-01-01T00:00:00.000Z',
  },
  // 公開日の無い記事（年別アーカイブでは数えない）
  { id: 'p14', tag: [], category: [] },
];

afterEach(() => {
  vi.clearAllMocks();
});

const cases = [
  {
    name: 'タグ別',
    page: tagsPage,
    key: 'tagId',
    endpoint: 'tags',
    ids: ['react', 'vue', 'unused'],
    filter: 'tag[contains]react',
    expectedParams: [
      { tagId: 'react', num: '1' },
      { tagId: 'react', num: '2' },
      { tagId: 'vue', num: '1' },
      { tagId: 'unused', num: '1' },
    ],
  },
  {
    name: 'カテゴリー別',
    page: categoriesPage,
    key: 'catId',
    endpoint: 'categories',
    ids: ['frontend', 'other', 'unused'],
    filter: 'category[contains]frontend',
    expectedParams: [
      { catId: 'frontend', num: '1' },
      { catId: 'frontend', num: '2' },
      { catId: 'other', num: '1' },
      { catId: 'unused', num: '1' },
    ],
  },
] as const;

describe.each(cases)(
  '$name一覧の page/[num]',
  ({ page, key, endpoint, ids, filter, expectedParams }) => {
    const params = (num: string) => Promise.resolve({ [key]: ids[0], num }) as never;

    it('ページ数を全記事数ではなく、それぞれの記事数から計算する（記事の無いものは 1 ページ目だけ）', async () => {
      mocks.getAllContents.mockResolvedValue(ids.map((id) => ({ id })));
      mocks.fetchBlogSummaryAll.mockResolvedValue(posts);

      await expect(page.generateStaticParams()).resolves.toEqual(expectedParams);
      expect(mocks.getAllContents).toHaveBeenCalledWith({ endpoint });
    });

    it.each([
      ['全記事の一覧', 'fetchBlogSummaryAll'],
      [`${endpoint} の一覧`, 'getAllContents'],
    ] as const)('%s の取得に失敗したら、1 ページ目だけにせずエラーを投げる', async (_, failing) => {
      const error = new Error('microCMS down');
      mocks.getAllContents.mockResolvedValue(ids.map((id) => ({ id })));
      mocks.fetchBlogSummaryAll.mockResolvedValue(posts);
      mocks[failing].mockRejectedValue(error);

      await expect(page.generateStaticParams()).rejects.toBe(error);
    });

    it('範囲内のページ番号なら、そのページの記事を取得して表示する', async () => {
      mocks.fetchBlogList.mockResolvedValue({ contents: [], totalCount: 13 });
      mocks.fetchBlogDetail.mockResolvedValue({ name: ids[0] });

      const rendered = (await page.default({ params: params('2') })) as unknown as {
        props: { pager: { currentPage: unknown } };
      };
      expect(rendered.props.pager.currentPage).toBe(2);

      expect(mocks.fetchBlogList).toHaveBeenCalledWith('blog', {
        limit: 12,
        filters: filter,
        offset: 12,
      });
      expect(mocks.notFound).not.toHaveBeenCalled();
    });

    it('記事数から見て存在しないページ番号なら notFound() を返す', async () => {
      mocks.fetchBlogList.mockResolvedValue({ contents: [], totalCount: 13 });
      mocks.fetchBlogDetail.mockResolvedValue({ name: ids[0] });

      await expect(page.default({ params: params('3') })).rejects.toBe(NOT_FOUND);
    });

    it('記事が 0 件でも 1 ページ目は表示する（「記事がありません」）', async () => {
      mocks.fetchBlogList.mockResolvedValue({ contents: [], totalCount: 0 });
      mocks.fetchBlogDetail.mockResolvedValue({ name: ids[0] });

      await page.default({ params: params('1') });
      expect(mocks.notFound).not.toHaveBeenCalled();
    });

    it.each(['0', 'abc', '1.5'])(
      'ページ番号が %s なら microCMS に問い合わせずに notFound() を返す',
      async (num) => {
        await expect(page.default({ params: params(num) })).rejects.toBe(NOT_FOUND);
        await expect(page.generateMetadata({ params: params(num) })).rejects.toBe(NOT_FOUND);
        expect(mocks.fetchBlogList).not.toHaveBeenCalled();
        expect(mocks.fetchBlogDetail).not.toHaveBeenCalled();
      }
    );
  }
);

describe('年別アーカイブの page/[num]', () => {
  const params = (num: string) => Promise.resolve({ year: '2024', num });

  it('ページ数を全記事数ではなく、年ごとの記事数から計算する', async () => {
    mocks.fetchBlogSummaryAll.mockResolvedValue(posts);

    const generated = await archivePage.generateStaticParams();
    // 順序は問わない（公開日の無い記事は数えない）
    expect(generated).toHaveLength(3);
    expect(generated).toEqual(
      expect.arrayContaining([
        { year: '2024', num: '1' },
        { year: '2024', num: '2' },
        { year: '2023', num: '1' },
      ])
    );
  });

  it('範囲内のページ番号なら、その年の記事を取得して表示する', async () => {
    mocks.fetchBlogList.mockResolvedValue({ contents: [], totalCount: 13 });

    await archivePage.default({ params: params('2') });

    expect(mocks.fetchBlogList).toHaveBeenCalledWith('blog', {
      limit: 12,
      filters: 'publishedAt[contains]2024',
      offset: 12,
    });
  });

  it('記事数から見て存在しないページ番号なら notFound() を返す', async () => {
    mocks.fetchBlogList.mockResolvedValue({ contents: [], totalCount: 13 });

    await expect(archivePage.default({ params: params('3') })).rejects.toBe(NOT_FOUND);
  });

  it.each(['0', 'abc', '1.5'])(
    'ページ番号が %s なら microCMS に問い合わせずに notFound() を返す',
    async (num) => {
      await expect(archivePage.default({ params: params(num) })).rejects.toBe(NOT_FOUND);
      expect(mocks.fetchBlogList).not.toHaveBeenCalled();
    }
  );

  it.each(['20', 'abcd', '20245'])(
    '年が 4 桁の数字でない（%s）なら microCMS に問い合わせずに notFound() を返す',
    async (year) => {
      const result = archivePage.default({ params: Promise.resolve({ year, num: '1' }) });
      await expect(result).rejects.toBe(NOT_FOUND);
      expect(mocks.fetchBlogList).not.toHaveBeenCalled();
    }
  );

  it('記事の無い年は、1 ページ目でも notFound() を返す', async () => {
    mocks.fetchBlogList.mockResolvedValue({ contents: [], totalCount: 0 });

    await expect(archivePage.default({ params: params('1') })).rejects.toBe(NOT_FOUND);
  });
});

describe('年別アーカイブの一覧（/blog/archive/[year]/）', () => {
  it('記事の公開年だけを生成する', async () => {
    mocks.fetchBlogSummaryAll.mockResolvedValue(posts);

    const generated = await archiveTopPage.generateStaticParams();
    expect(generated).toHaveLength(2);
    expect(generated).toEqual(expect.arrayContaining([{ year: '2024' }, { year: '2023' }]));
  });

  it('年が 4 桁の数字でなければ microCMS に問い合わせずに notFound() を返す', async () => {
    const result = archiveTopPage.default({ params: Promise.resolve({ year: '20' }) });
    await expect(result).rejects.toBe(NOT_FOUND);
    expect(mocks.fetchBlogList).not.toHaveBeenCalled();
  });

  it('記事の無い年は notFound() を返す', async () => {
    mocks.fetchBlogList.mockResolvedValue({ contents: [], totalCount: 0 });

    const result = archiveTopPage.default({ params: Promise.resolve({ year: '1999' }) });
    await expect(result).rejects.toBe(NOT_FOUND);
  });
});
