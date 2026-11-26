import type { Metadata } from 'next';
import { listPath } from '@/src/libs/blog/listPath';
import { SITE_URL } from '@/src/constants/site';
import { BlogListLayout } from '@/src/features/blog';
import { fetchBlogSummaryAll, fetchBlogList } from '@/src/libs/microcms/blog';
import { LIMIT } from '@/src/constants/blog';
import { countPostsByYear, isValidYear } from '@/src/libs/blog/countPostsByYear';
import { notFound } from 'next/navigation';

type Props = {
  params: Promise<{ year: string }>;
};

export const revalidate = 3600;

export async function generateStaticParams() {
  const counts = countPostsByYear(await fetchBlogSummaryAll());

  return Object.keys(counts).map((year) => ({ year }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;

  return {
    title: `${year}年 | 投稿`,
    description: `「${year}年」の一覧ページです。`,
    openGraph: {
      description: `「${year}年」の一覧ページです。`,
    },
    alternates: { canonical: listPath('archive', year) },
  };
}

export default async function Page({ params }: Props) {
  const { year } = await params;
  if (!isValidYear(year)) notFound();

  const { contents, totalCount } = await fetchBlogList('blog', {
    limit: LIMIT,
    filters: `publishedAt[contains]${year}`,
  });
  // 年は記事の公開日から作るので、記事の無い年は存在しない年として扱う
  if (totalCount === 0) notFound();

  const yearLabel = `${year}年`;

  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: '投稿', url: `/blog/` },
    { name: `${yearLabel}`, url: listPath('archive', year) },
  ];

  const type = {
    slug: 'archive',
    id: year,
    name: yearLabel,
  };

  return (
    <BlogListLayout
      breadcrumb={breadcrumb}
      title={yearLabel}
      contents={contents}
      pager={{ totalCount, limit: LIMIT, currentPage: 1 }}
      type={type}
    />
  );
}
