import styles from "@/src/styles/pages/blog/layout.module.css";
import { SITE_URL } from "@/src/constants/site";
import { Breadcrumb, SectionTitle } from "@/src/components";
import { fetchBlogList } from "@/src/libs/microcms/blog";
import { ArticleCardList, AsideMenu, Pagenation } from "@/src/features/blog";
import { Metadata } from 'next';
import { LIMIT } from "@/src/constants/blog";

type generateMetadataProps = {
  params: Promise<{ num: string }>
}

type Props = {
  params: Promise<{
    num: string;
  }>
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const { num } = params;

  return {
    metadataBase: new URL('https://www.jsato1993.com/'),
    title: `${num}ページ | 投稿 | J.Sato`,
    description: `「${num}」ページ目`,
    openGraph: {
      description: `「${num}」ページ目`
    }
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
        { name: '投稿', url: `${SITE_URL}/blog/` },
        { name: `${num}ページ`, url: `${SITE_URL}/blog/page/${num}/` }
      ]} />
      <div className={styles.container}>
        <section>
          <SectionTitle title="投稿" />
          <ArticleCardList contents={contents} />
          <Pagenation pager={{ totalCount, limit: LIMIT, currentPage: Number(num) }} />
        </section>
        <AsideMenu />
      </div>
    </>
  )
}