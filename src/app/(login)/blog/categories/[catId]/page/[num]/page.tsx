import { LIMIT } from '@/src/constants/blog';
import { SITE_URL } from '@/src/constants/site';
import {
  client,
  fetchBlogDetail,
  fetchBlogList,
  fetchBlogSummaryAll,
} from '@/src/libs/microcms/blog';
import { getTotalCount } from '@/src/libs/blog/getTotalCount';
import { isPageInRange, pageNumbers, parsePageNumber } from '@/src/libs/blog/pagination';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { BlogListLayout } from '@/src/features/blog';

type generateMetadataProps = {
  params: Promise<{
    catId: string;
    num: string;
  }>;
};

type Props = {
  params: Promise<{
    catId: string;
    num: string;
  }>;
};

export const revalidate = 3600;

export async function generateStaticParams() {
  const [categories, posts] = await Promise.all([
    client.getAllContents({ endpoint: 'categories' }),
    fetchBlogSummaryAll(),
  ]);
  // ページ数はカテゴリーごとの記事数から計算する（記事の無いカテゴリーは 1 ページ目だけ）
  const counts = getTotalCount(posts, 'category');

  return categories.flatMap(({ id }) =>
    pageNumbers(counts[id]?.count ?? 0).map((num) => ({ catId: id, num }))
  );
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const { catId, num } = params;
  // 不正なページ番号なら、タイトル用の取得もせずに 404 にする
  if (parsePageNumber(num) === undefined) notFound();
  const cat = await fetchBlogDetail('categories', catId);

  return {
    title: `${num}ページ目 | ${cat?.name} | 投稿 | ポートフォリオサイト`,
    description: `「${cat?.name}」の${num}ページ目です。`,
    openGraph: {
      description: `「${cat?.name}」の${num}ページ目です。`,
    },
    robots: num === '1' ? 'noindex, follow' : 'index, follow',
    alternates:
      num === '1' ? { canonical: '/blog/' } : { canonical: `/blog/categories/page/${num}/` },
  };
}

export default async function Page({ params }: Props) {
  const { catId, num } = await params;
  const page = parsePageNumber(num);
  if (page === undefined) notFound();

  const [{ contents, totalCount }, categoryContent] = await Promise.all([
    fetchBlogList('blog', {
      limit: LIMIT,
      filters: `category[contains]${catId}`,
      offset: LIMIT * (page - 1),
    }),
    fetchBlogDetail('categories', catId),
  ]);
  if (!isPageInRange(page, totalCount)) notFound();
  const catName = categoryContent.name;

  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: '投稿', url: `/blog/` },
    { name: `${catName} | ${num}ページ`, url: `/blog/categories/${num}/` },
  ];

  const type = {
    slug: 'categories',
    id: catId,
    name: catName,
  };

  return (
    <BlogListLayout
      breadcrumb={breadcrumb}
      title={`${catName} | ${num}ページ`}
      contents={contents}
      pager={{ totalCount, limit: LIMIT, currentPage: page }}
      type={type}
    />
  );
}
