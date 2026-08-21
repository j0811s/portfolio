import styles from '@/src/styles/pages/blog/layout.module.css';
import { SITE_URL } from '@/src/constants/site';
import { LIMIT } from '@/src/constants/blog';
import { Breadcrumb } from '@/src/components';
import { fetchBlogList } from '@/src/libs/microcms/blog';
import { AsideMenu, SearchExperience } from '@/src/features/blog';
import type { Metadata } from 'next';
import { metadata as rootMetadata } from '@/src/app/layout';

type Props = {
  searchParams: Promise<{ q?: string; page?: string }>;
};

const parsePage = (value: string | undefined): number => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : 1;
};

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q, page } = await searchParams;
  const keyword = q?.trim() ?? '';
  const pageNum = parsePage(page);

  const title = keyword
    ? `「${keyword}」の検索結果`
    : pageNum > 1
      ? `${pageNum}ページ目 | 投稿`
      : '投稿';

  return {
    ...rootMetadata,
    title,
    description: `「投稿」の一覧ページです。`,
    openGraph: {
      description: `「投稿」の一覧ページです。`,
    },
    robots: keyword ? { index: false } : pageNum > 1 ? 'index, follow' : undefined,
    alternates: {
      canonical: !keyword && pageNum > 1 ? `/blog/?page=${pageNum}` : '/blog/',
    },
  };
}

export default async function Page({ searchParams }: Props) {
  const { q, page } = await searchParams;
  const keyword = q?.trim() ?? '';
  const pageNum = parsePage(page);

  const { contents, totalCount } = await fetchBlogList('blog', {
    q: keyword || undefined,
    limit: LIMIT,
    offset: LIMIT * (pageNum - 1),
    fields: 'id,title,eyecatch,publishedAt,updatedAt',
  });

  return (
    <>
      <Breadcrumb
        data={[
          { name: 'トップページ', url: SITE_URL },
          { name: '投稿', url: '/blog/' },
        ]}
      />
      <div className={styles.container}>
        <SearchExperience
          initialKeyword={keyword}
          initialPage={pageNum}
          initialContents={contents}
          initialTotalCount={totalCount}
        />
        <AsideMenu />
      </div>
    </>
  );
}
