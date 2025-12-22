import styles from "@/src/styles/pages/blog/layout.module.css";
import { SITE_URL } from "@/src/constants/site";
import { LIMIT} from "@/src/constants/blog";
import { Breadcrumb, SectionTitle } from "@/src/components";
import { fetchBlogList } from "@/src/libs/microcms/blog";
import { ArticleCardList, AsideMenu, Pagination } from "@/src/features/blog";
import { Metadata } from 'next';

type Props = {
  params: Promise<{
    num: string;
  }>
}

// export const revalidate = 3600;

/**
 * 静的に生成するページ番号を列挙
 */
export async function generateStaticParams() {
  const { totalCount } = await fetchBlogList('blog', { limit: LIMIT });
  const totalPages = Math.ceil(totalCount / LIMIT);

  return Array.from({ length: totalPages }, (_, i) => ({
    num: String(i + 1),
  }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { num } =  await params;

  return {
    title: `${num}ページ | 投稿 | ポートフォリオサイト`,
    description: `「${num}」ページ目`,
    openGraph: {
      description: `「${num}」ページ目`
    },
    robots: num === '1' ? 'noindex, follow' : 'index, follow',
    alternates: num === '1'
      ? { canonical: '/blog/' }
      : { canonical: `/blog/page/${num}/` },
  }
}

export default async function Page({ params }: Props) {
  const { num } = await params;
  const { contents, totalCount } = await fetchBlogList('blog', {
    limit: LIMIT,
    offset: LIMIT * (Number(num) - 1)
  });

  return (
    <>
      <Breadcrumb data={[
        { name: 'トップページ', url: SITE_URL },
        { name: '投稿', url: `/blog/` },
        { name: `${num}ページ`, url: `/blog/page/${num}/` }
      ]} />
      <div className={styles.container}>
        <section>
          <SectionTitle title="投稿" />
          <ArticleCardList contents={contents} />
          <Pagination pager={{ totalCount, limit: LIMIT, currentPage: Number(num) }} />
        </section>
        <AsideMenu />
      </div>
    </>
  )
}