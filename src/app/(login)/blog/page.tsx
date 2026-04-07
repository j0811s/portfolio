import styles from "@/src/styles/pages/blog/layout.module.css";
import { SITE_URL } from "@/src/constants/site";
import { LIMIT } from "@/src/constants/blog";
import { Breadcrumb, SectionTitle } from "@/src/components";
import { fetchBlogList } from "@/src/libs/microcms/blog";
import { ArticleCardList, AsideMenu, Pagination, SearchForm } from "@/src/features/blog";
import { Metadata } from 'next';
import { metadata as rootMetadata } from '@/src/app/layout';

// export const revalidate = 3600;

export async function generateMetadata(): Promise<Metadata> {

  return {
    ...rootMetadata,
    title: `投稿`,
    description: `「投稿」の一覧ページです。`,
    openGraph: {
      description: `「投稿」の一覧ページです。`
    }
  }
}

export default async function Page() {
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
          <SearchForm />
          <ArticleCardList contents={contents} />
          <Pagination pager={{ totalCount, limit: LIMIT, currentPage: 1 }} />
        </section>
        <AsideMenu />
      </div>
    </>
  )
}
