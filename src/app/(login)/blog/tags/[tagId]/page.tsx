import styles from "@/src/styles/pages/blog/layout.module.css";
import { Metadata } from 'next';
import { SITE_URL } from "@/src/constants/site";
import { Breadcrumb, SectionTitle } from "@/src/components";
import { ArticleCardList, AsideMenu, Pagination } from "@/src/features/blog";
import { client, fetchBlogDetail, fetchBlogList } from "@/src/libs/microcms/blog";
import { LIMIT } from "@/src/constants/blog";

type Props = {
  params: Promise<{
    tagId: string;
  }>;
}

// export const revalidate = 3600;

export async function generateStaticParams() {
  const tags = await client.getAllContents({ endpoint: 'tags' });

  return tags.map(({ id }) => ({ tagId: id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tagId } = await params;
  const tag = await fetchBlogDetail('tags', tagId);

  return {
    title: `${tag?.name ?? ''} | 投稿`,
    description: `「${tag?.name ?? 'タグ'}」の一覧ページです。`,
    openGraph: {
      description: `「${tag?.name ?? 'タグ'}」の一覧ページです。`
    }
  }
}

export default async function Page({ params }: Props) {
  const { tagId } = await params;
  const { contents, totalCount } = await fetchBlogList('blog', {
    limit: LIMIT,
    filters: `tag[contains]${tagId}`
  });
  
  const tagContent = await fetchBlogDetail('tags', tagId);
  const tagName = tagContent.name;

  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: '投稿', url: `/blog/` },
    { name: tagName, url: `/blog/tags/${tagId}/` }
  ];

  const type = {
    slug: 'tags',
    id: tagId,
    name: tagName
  }

  return (
    <>
      <Breadcrumb data={breadcrumb} />
      <div className={styles.container}>
        <section>
          <SectionTitle title={tagName} />
          <ArticleCardList contents={contents} />
          <Pagination pager={{ totalCount, limit: LIMIT, currentPage: 1 }} type={type} />
        </section>
        <AsideMenu />
      </div>
    </>
  )
}
