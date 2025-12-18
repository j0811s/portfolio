import { SITE_URL } from "@/src/constants/site";
import { Breadcrumb, JsonLd, SectionTitle } from "@/src/components";
import { fetchBlogList } from "@/src/libs/microcms/blog";
import { createBreadcrumbJsonLd } from "@/src/libs/seo/jsonLd";
import { ArticleCardList } from "@/src/features/blog";

export default async function Page({ params }: PageProps) {
  const { contents, totalCount } = await fetchBlogList('blog', { limit: 12 });

  return (
    <section>
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: 'トップページ', url: SITE_URL },
          { name: '投稿', url: `${SITE_URL}/blog/` }
        ])}
      />
      <Breadcrumb data={[
        { name: 'トップページ', url: SITE_URL },
        { name: '投稿', url: `${SITE_URL}/blog/` }
      ]} />
      <SectionTitle title="投稿" />
      <ArticleCardList contents={contents} />
    </section>
  )
}