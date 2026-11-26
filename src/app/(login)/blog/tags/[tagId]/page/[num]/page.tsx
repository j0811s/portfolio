import { LIMIT } from '@/src/constants/blog';
import { listPath, pagedListCanonical } from '@/src/libs/blog/listPath';
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

type Props = {
  params: Promise<{
    tagId: string;
    num: string;
  }>;
};

export const revalidate = 3600;

export async function generateStaticParams() {
  const [tags, posts] = await Promise.all([
    client.getAllContents({ endpoint: 'tags' }),
    fetchBlogSummaryAll(),
  ]);
  // ページ数はタグごとの記事数から計算する（記事の無いタグは 1 ページ目だけ）
  const counts = getTotalCount(posts, 'tag');

  return tags.flatMap(({ id }) =>
    pageNumbers(counts[id]?.count ?? 0).map((num) => ({ tagId: id, num }))
  );
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tagId, num } = await params;
  // 不正なページ番号なら、タイトル用の取得もせずに 404 にする
  const page = parsePageNumber(num);
  if (page === undefined) notFound();
  const tag = await fetchBlogDetail('tags', tagId);

  return {
    title: `${num}ページ目 | ${tag.name} | 投稿 | ポートフォリオサイト`,
    description: `「${tag.name}」の${num}ページ目です。`,
    openGraph: {
      description: `「${tag.name}」の${num}ページ目です。`,
    },
    robots: page === 1 ? 'noindex, follow' : 'index, follow',
    alternates: { canonical: pagedListCanonical('tags', tagId, page) },
  };
}

export default async function Page({ params }: Props) {
  const { tagId, num } = await params;
  const page = parsePageNumber(num);
  if (page === undefined) notFound();

  const [{ contents, totalCount }, tagContent] = await Promise.all([
    fetchBlogList('blog', {
      limit: LIMIT,
      filters: `tag[contains]${tagId}`,
      offset: LIMIT * (page - 1),
    }),
    fetchBlogDetail('tags', tagId),
  ]);
  if (!isPageInRange(page, totalCount)) notFound();
  const tagName = tagContent.name;

  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: '投稿', url: `/blog/` },
    { name: `${tagName} | ${num}ページ`, url: listPath('tags', tagId, page) },
  ];

  const type = {
    slug: 'tags',
    id: tagId,
    name: tagName,
  };

  return (
    <BlogListLayout
      breadcrumb={breadcrumb}
      title={`${tagName} | ${num}ページ`}
      contents={contents}
      pager={{ totalCount, limit: LIMIT, currentPage: page }}
      type={type}
    />
  );
}
