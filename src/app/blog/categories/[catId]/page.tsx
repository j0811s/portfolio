import styles from "@/src/styles/pages/blog/layout.module.css";
import { Metadata, ResolvingMetadata } from 'next';
import { SITE_URL } from "@/src/constants/site";
import { Breadcrumb, SectionTitle } from "@/src/components";
import { ArticleCardList, AsideMenu, Pagenation } from "@/src/features/blog";
import { client, fetchBlogDetail, fetchBlogList } from "@/src/libs/microcms/blog";
import { LIMIT } from "@/src/constants/blog";
import { metadata as rootMetadata } from '@/src/app/layout';

type Props = {
  params: Promise<{
    catId: string
  }>
}

// export const revalidate = 3600;

export async function generateStaticParams() {
  const categories = await client.getAllContents({
    endpoint: 'categories'
  });

  return categories.map(({ id }) => ({ catId: id }));
}

export async function generateMetadata({ params }: Props, parent: ResolvingMetadata): Promise<Metadata> {
  const { catId } = await params;
  const cat = await fetchBlogDetail('categories', catId);

  return {
    ...rootMetadata,
    title: `${cat?.name} | 投稿`,
    description: `「${cat?.name}」の一覧ページです。`,
    openGraph: {
      description: `「${cat?.name}」の一覧ページです。`
    }
  }
}

export default async function Page({ params }: Props) {
  const { catId } = await params;
  const { contents, totalCount } = await fetchBlogList('blog', {
    limit: LIMIT,
    filters: `category[contains]${catId}`
  });
  const categoryContent = await fetchBlogDetail('categories', catId);
  const catName = categoryContent.name;
  
  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: '投稿', url: `/blog/` },
    { name: catName, url: `/blog/categories/${catId}/` }
  ];

  const type = {
    slug: 'categories',
    id: catId,
    name: catName
  }

  return (
    <>
      <Breadcrumb data={breadcrumb} />
      <div className={styles.container}>
        <section>
          <SectionTitle title={catName} />
          <ArticleCardList contents={contents} />
          <Pagenation pager={{ totalCount, limit: LIMIT, currentPage: 1 }} type={type} />
        </section>
        <AsideMenu />
      </div>
    </>
  )
}
