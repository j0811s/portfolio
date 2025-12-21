import styles from "@/src/styles/pages/blog/layout.module.css";
import { Metadata } from 'next';
import { SITE_URL } from "@/src/constants/site";
import { Breadcrumb, SectionTitle } from "@/src/components";
import { ArticleCardList, AsideMenu, Pagenation } from "@/src/features/blog";
import { fetchBlogListAll, fetchBlogList } from "@/src/libs/microcms/blog";
import { LIMIT } from "@/src/constants/blog";

type Props = {
  params: Promise<{ year: string }>
}

export const revalidate = 3600;

export async function generateStaticParams() {
  const posts = await fetchBlogListAll('blog');
  const years = Array.from(new Set(posts.map(post => post.publishedAt.slice(0, 4))));
  
  return years.map(year => ({ year }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { year } = await params;

  return {
    title: `${year}年 | 年別アーカイブ | 投稿 | J.Sato`,
    description: `「${year}年」の一覧ページです。`,
    openGraph: {
      description: `「${year}年」の一覧ページです。`
    }
  }
}

export default async function Page({ params }: Props) {
  const { year } = await params;
  const { contents, totalCount } = await fetchBlogList('blog', {
    limit: LIMIT,
    filters: `publishedAt[contains]${year}`
  });

  const yearLabel = `${year}年`;

  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: '年別アーカイブ | 投稿', url: `/blog/` },
    { name: `${yearLabel}`, url: `/blog/tags/page/${year}/` }
  ];

  const type = {
    slug: 'archive',
    id: year,
    name: yearLabel
  }

  return (
    <>
      <Breadcrumb data={breadcrumb} />
      <div className={styles.container}>
        <section>
          <SectionTitle title={yearLabel} />
          <ArticleCardList contents={contents} />
          <Pagenation pager={{ totalCount, limit: LIMIT, currentPage: 1 }} type={type} />
        </section>
        <AsideMenu />
      </div>
    </>
  )
}
