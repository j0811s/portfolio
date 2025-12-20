import styles from "@/src/styles/pages/blog/layout.module.css";
import { LIMIT } from '@/src/constants/blog';
import { SITE_URL } from '@/src/constants/site';
import { fetchBlogDetail, fetchBlogList } from '@/src/libs/microcms/blog';
import { Metadata } from 'next';
import { Breadcrumb, SectionTitle } from "@/src/components";
import { ArticleCardList, AsideMenu, Pagenation } from "@/src/features/blog";


type generateMetadataProps = {
  params: Promise<{
    catId: string;
    num: string;
  }>
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const { catId, num } = params;
  const cat = await fetchBlogDetail('categories', catId);

  return {
    metadataBase: new URL('https://www.jsato1993.com/'),
    title: `${num}ページ目 | ${cat?.name} | カテゴリー | 投稿 | J.Sato`,
    description: `「${cat?.name}」の${num}ページ目です。`,
    openGraph: {
      description: `「${cat?.name}」の${num}ページ目です。`
    }
  }
}

type Props = {
  params: Promise<{
    catId: string;
    num: string;
  }>
}

export default async function Page({ params }: Props) {
  const { catId, num } = await params;
  const { contents, totalCount } = await fetchBlogList('blog', {
    limit: LIMIT,
    filters: `category[contains]${catId}`,
    offset: LIMIT * (Number(num) - 1)
  });
  
  const catName = contents[0].category.filter(cat => cat.id === catId)[0].name;

  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: '投稿', url: `${SITE_URL}/blog/` },
    { name: `${catName} | ${num}ページ`, url: `${SITE_URL}/blog/categories/page/${num}/` }
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
          <SectionTitle title={`${catName} | ${num}ページ`} />
          <ArticleCardList contents={contents} />
          <Pagenation pager={{ totalCount, limit: LIMIT, currentPage: Number(num) }} type={type} />
        </section>
        <AsideMenu />
      </div>
    </>
  )
}
