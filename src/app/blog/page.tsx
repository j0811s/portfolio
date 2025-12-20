import styles from "@/src/styles/pages/blog/layout.module.css";
import { SITE_URL } from "@/src/constants/site";
import { LIMIT } from "@/src/constants/blog";
import { Breadcrumb, SectionTitle } from "@/src/components";
import { fetchBlogList } from "@/src/libs/microcms/blog";
import { ArticleCardList, AsideMenu, Pagenation } from "@/src/features/blog";

export default async function Page({ params }: SitePageProps) {
  const { contents, totalCount } = await fetchBlogList('blog', { limit: LIMIT });

  return (
    <>
      <Breadcrumb data={[
        { name: 'トップページ', url: SITE_URL },
        { name: '投稿', url: `/blog/` }
      ]} />
      <div className={styles.container}>
        <section>
          <SectionTitle title="投稿" />
          <ArticleCardList contents={contents} />
          <Pagenation pager={{ totalCount, limit: LIMIT, currentPage: 1 }} />
        </section>
        <AsideMenu />
      </div>
    </>
  )
}