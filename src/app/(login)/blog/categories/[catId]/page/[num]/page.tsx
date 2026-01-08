import styles from "@/src/styles/pages/blog/layout.module.css";
import { LIMIT } from '@/src/constants/blog';
import { SITE_URL } from '@/src/constants/site';
import { client, fetchBlogDetail, fetchBlogList } from '@/src/libs/microcms/blog';
import { Metadata } from 'next';
import { Breadcrumb, SectionTitle } from "@/src/components";
import { ArticleCardList, AsideMenu, Pagination } from "@/src/features/blog";

type generateMetadataProps = {
  params: Promise<{
    catId: string;
    num: string;
  }>
}

type Props = {
  params: Promise<{
    catId: string;
    num: string;
  }>
}

// export const revalidate = 3600;

export async function generateStaticParams() {
  // すべてのパラメータ
  const allParams: { catId: string; num: string }[] = [];

  // カテゴリー
  const categories = await client.getAllContents({ endpoint: 'categories' });
  const catIds = categories.map(({ id }) => id);

  // ページ数
  const { totalCount } = await fetchBlogList('blog', { limit: LIMIT });
  const totalPages = Math.ceil(totalCount / LIMIT);

  // パラメータを1箇所にまとめる
  for (const catId of catIds) {
    for (let i = 1; i <= totalPages; i++) {
      allParams.push({
        catId: catId,
        num: String(i),
      });
    }
  }

  return allParams;
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const { catId, num } = params;
  const cat = await fetchBlogDetail('categories', catId);

  return {
    title: `${num}ページ目 | ${cat?.name} | 投稿 | ポートフォリオサイト`,
    description: `「${cat?.name}」の${num}ページ目です。`,
    openGraph: {
      description: `「${cat?.name}」の${num}ページ目です。`
    },
    robots: num === '1' ? 'noindex, follow' : 'index, follow',
    alternates: num === '1'
      ? { canonical: '/blog/' }
      : { canonical: `/blog/categories/page/${num}/` },
  }
}

export default async function Page({ params }: Props) {
  const { catId, num } = await params;
  const { contents, totalCount } = await fetchBlogList('blog', {
    limit: LIMIT,
    filters: `category[contains]${catId}`,
    offset: LIMIT * (Number(num) - 1)
  });
  
  const categoryContent = await fetchBlogDetail('categories', catId);
  const catName = categoryContent.name;

  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: '投稿', url: `/blog/` },
    { name: `${catName} | ${num}ページ`, url: `/blog/categories/${num}/` }
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
          <Pagination pager={{ totalCount, limit: LIMIT, currentPage: Number(num) }} type={type} />
        </section>
        <AsideMenu />
      </div>
    </>
  )
}
