import styles from "@/src/styles/pages/blog/layout.module.css";
import { LIMIT } from '@/src/constants/blog';
import { SITE_URL } from '@/src/constants/site';
import { client, fetchBlogDetail, fetchBlogList } from '@/src/libs/microcms/blog';
import { Metadata } from 'next';
import { Breadcrumb, SectionTitle } from "@/src/components";
import { ArticleCardList, AsideMenu, Pagenation } from "@/src/features/blog";

type Props = {
  params: Promise<{
    tagId: string;
    num: string;
  }>
}

export const revalidate = 3600;

export async function generateStaticParams() {
  // すべてのパラメータ
  const allParams: { tagId: string; num: string }[] = [];

  // タグ
  const tags = await client.getAllContents({ endpoint: 'tags' });
  const tagIds = tags.map(({ id }) => id);

  // ページ数
  const { totalCount } = await fetchBlogList('blog', { limit: LIMIT });
  const totalPages = Math.ceil(totalCount / LIMIT);

  // パラメータを1箇所にまとめる
  for (const tagId of tagIds) {
    for (let i = 1; i <= totalPages; i++) {
      allParams.push({
        tagId: String(tagId),
        num: String(i),
      });
    }
  }

  return allParams;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { tagId, num } = await params;
  const tag = await fetchBlogDetail('tags', tagId);

  return {
    title: `${num}ページ目 | ${tag.name} | タグ | 投稿 | ポートフォリオサイト`,
    description: `「${tag.name}」の${num}ページ目です。`,
    openGraph: {
      description: `「${tag.name}」の${num}ページ目です。`
    },
    robots: num === '1' ? 'noindex, follow' : 'index, follow',
    alternates: num === '1'
      ? { canonical: '/blog/' }
      : { canonical: `/blog/tags/${num}/` },
  }
}

export default async function Page({ params }: Props) {
  const { tagId, num } = await params;
  const { contents, totalCount } = await fetchBlogList('blog', {
    limit: LIMIT,
    filters: `tag[contains]${tagId}`,
    offset: LIMIT * (Number(num) - 1)
  });
  
  const tagContent = await fetchBlogDetail('tags', tagId);
  const tagName = tagContent.name;

  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: 'タグ | 投稿', url: `/blog/` },
    { name: `${tagName} | ${num}ページ`, url: `/blog/tags/page/${num}/` }
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
          <SectionTitle title={`${tagName} | ${num}ページ`} />
          <ArticleCardList contents={contents} />
          <Pagenation pager={{ totalCount, limit: LIMIT, currentPage: Number(num) }} type={type} />
        </section>
        <AsideMenu />
      </div>
    </>
  )
}
