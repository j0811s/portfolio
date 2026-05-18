import styles from '@/src/styles/pages/blog/layout.module.css';
import { LIMIT } from '@/src/constants/blog';
import { SITE_URL } from '@/src/constants/site';
import { fetchBlogList, fetchBlogListAll } from '@/src/libs/microcms/blog';
import type { Metadata } from 'next';
import { Breadcrumb, SectionTitle } from '@/src/components';
import { ArticleCardList, AsideMenu, Pagination } from '@/src/features/blog';

type Props = {
  params: Promise<{
    year: string;
    num: string;
  }>;
};

// export const revalidate = 3600;

export async function generateStaticParams() {
  // すべてのパラメータ
  const allParams: { year: string; num: string }[] = [];

  // 公開年
  const posts = await fetchBlogListAll('blog');
  const years = Array.from(
    new Set(posts.flatMap((post) => (post.publishedAt ? [post.publishedAt.slice(0, 4)] : [])))
  );

  // ページ数
  const { totalCount } = await fetchBlogList('blog', { limit: LIMIT });
  const totalPages = Math.ceil(totalCount / LIMIT);

  // パラメータを1箇所にまとめる
  for (const year of years) {
    for (let i = 1; i <= totalPages; i++) {
      allParams.push({
        year: year,
        num: String(i),
      });
    }
  }

  return allParams;
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
  const { contents, totalCount } = await fetchBlogList('blog', {
    limit: LIMIT,
    filters: `publishedAt[contains]${year}`,
    offset: LIMIT * (Number(num) - 1),
  });

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
    <>
      <Breadcrumb data={breadcrumb} />
      <div className={styles.container}>
        <section>
          <SectionTitle title={`${yearLabel} | ${num}ページ`} />
          <ArticleCardList contents={contents} />
          <Pagination pager={{ totalCount, limit: LIMIT, currentPage: Number(num) }} type={type} />
        </section>
        <AsideMenu />
      </div>
    </>
  );
}
