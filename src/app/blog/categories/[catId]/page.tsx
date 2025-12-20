import styles from "@/src/styles/pages/blog/layout.module.css";
import { Metadata } from 'next';
import { SITE_URL } from "@/src/constants/site";
import { Breadcrumb, SectionTitle } from "@/src/components";
import { ArticleCardList, AsideMenu, Pagenation } from "@/src/features/blog";
import { fetchBlogDetail, fetchBlogList } from "@/src/libs/microcms/blog";
import { LIMIT } from "@/src/constants/blog";

type generateMetadataProps = {
  params: Promise<{ catId: string }>
}

type Props = {
  params: Promise<{
    catId: string;
  }>;
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const cat = await fetchBlogDetail('categories', params.catId);

  return {
    metadataBase: new URL('https://www.jsato1993.com/'),
    title: `${cat?.name} | カテゴリー | 投稿 | J.Sato`,
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
  
  const catName = contents[0].category.filter(cat => cat.id === catId)[0].name;

  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: 'カテゴリー | 投稿', url: `/blog/` },
    { name: catName, url: `/blog/tags/page/${catId}/` }
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
