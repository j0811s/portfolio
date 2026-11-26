import { LIMIT } from '@/src/constants/blog';
import { SITE_URL } from '@/src/constants/site';
import { fetchBlogList, fetchBlogSummaryAll } from '@/src/libs/microcms/blog';
import { isPageInRange, pageNumbers, parsePageNumber } from '@/src/libs/blog/pagination';
import { notFound } from 'next/navigation';
import { countPostsByYear, isValidYear } from '@/src/libs/blog/countPostsByYear';
import type { Metadata } from 'next';
import { BlogListLayout } from '@/src/features/blog';

type Props = {
  params: Promise<{
    year: string;
    num: string;
  }>;
};

export const revalidate = 3600;

export async function generateStaticParams() {
  // 公開年ごとの記事数（ページ数は年ごとの記事数から計算する）
  const counts = countPostsByYear(await fetchBlogSummaryAll());

  return Object.entries(counts).flatMap(([year, count]) =>
    pageNumbers(count).map((num) => ({ year, num }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year, num } = await params;

  return {
    title: `${num}ページ目 | ${year}年 | 投稿 | ポートフォリオサイト`,
    description: `「${year}年」の${num}ページ目です。`,
    openGraph: {
      description: `「${year}年」の${num}ページ目です。`,
    },
    robots: num === '1' ? 'noindex, follow' : 'index, follow',
    alternates: num === '1' ? { canonical: '/blog/' } : { canonical: `/blog/archive/page/${num}/` },
  };
}

export default async function Page({ params }: Props) {
  const { year, num } = await params;
  const page = parsePageNumber(num);
  if (page === undefined || !isValidYear(year)) notFound();

  const { contents, totalCount } = await fetchBlogList('blog', {
    limit: LIMIT,
    filters: `publishedAt[contains]${year}`,
    offset: LIMIT * (page - 1),
  });
  // 年は記事の公開日から作るので、記事の無い年は存在しない年として扱う
  if (totalCount === 0 || !isPageInRange(page, totalCount)) notFound();

  const yearLabel = `${year}年`;

  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: '投稿', url: `/blog/` },
    { name: `${yearLabel} | ${num}ページ`, url: `/blog/archive/page/${num}/` },
  ];

  const type = {
    slug: 'archive',
    id: year,
    name: yearLabel,
  };

  return (
    <BlogListLayout
      breadcrumb={breadcrumb}
      title={`${yearLabel} | ${num}ページ`}
      contents={contents}
      pager={{ totalCount, limit: LIMIT, currentPage: page }}
      type={type}
    />
  );
}
