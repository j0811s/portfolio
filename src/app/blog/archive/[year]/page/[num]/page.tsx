import styles from "@/src/styles/pages/blog/layout.module.css";
import { LIMIT } from '@/src/constants/blog';
import { SITE_URL } from '@/src/constants/site';
import { fetchBlogDetail, fetchBlogList } from '@/src/libs/microcms/blog';
import { Metadata } from 'next';
import { Breadcrumb, SectionTitle } from "@/src/components";
import { ArticleCardList, AsideMenu, Pagenation } from "@/src/features/blog";

type generateMetadataProps = {
  params: Promise<{
    year: string;
    num: string;
  }>
}

type Props = {
  params: Promise<{
    year: string;
    num: string;
  }>
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const { year, num } = params;

  return {
    metadataBase: new URL('https://www.jsato1993.com/'),
    title: `${num}ページ目 | ${year}年 | 年別アーカイブ | 投稿 | J.Sato`,
    description: `「${year}年」の${num}ページ目です。`,
    openGraph: {
      description: `「${year}年」の${num}ページ目です。`
    }
  }
}

export default async function Page({ params }: Props) {
  const { year, num } = await params;
  const { contents, totalCount } = await fetchBlogList('blog', {
    limit: LIMIT,
    filters: `publishedAt[contains]${year}`,
    offset: LIMIT * (Number(num) - 1)
  });

  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: '投稿', url: `${SITE_URL}/blog/` },
    { name: `年別アーカイブ | ${num}ページ`, url: `${SITE_URL}/blog/archive/page/${num}/` }
  ];

  const type = {
    slug: 'archive',
    id: year,
    name: `${year}年`
  }

  return (
    <>
      <Breadcrumb data={breadcrumb} />
      <div className={styles.container}>
        <section>
          <SectionTitle title="年別アーカイブ | 投稿" />
          <ArticleCardList contents={contents} />
          <Pagenation pager={{ totalCount, limit: LIMIT, currentPage: Number(num) }} type={type} />
        </section>
        <AsideMenu />
      </div>
    </>
  )
}
