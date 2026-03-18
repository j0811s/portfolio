import styles from "@/src/styles/pages/blog/layout.module.css";
import { Metadata } from 'next';
import { cache } from 'react';
import { draftMode } from 'next/headers';
import { SITE_URL } from '@/src/constants/site';
import { Breadcrumb, JsonLd } from '@/src/components';
import { createArticleJsonLd } from '@/src/libs/seo/jsonLd';
import { ArticleDetail, AsideMenu, DraftBanner } from "@/src/features/blog";
import { fetchAllBlogId, fetchBlogDetail } from "@/src/libs/microcms/blog";
import { metadata as rootMetadata } from '@/src/app/layout';

const getBlogDetail = cache((postId: string) => fetchBlogDetail('blog', postId));

// export const revalidate = 3600;

type Props = {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ draftKey?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const post = await getBlogDetail(postId);

  return {
    ...rootMetadata,
    title: `${post?.title} | 投稿`,
    description: `「${post?.title}」の詳細ページです。`,
    openGraph: {
      description: `「${post?.title}」の詳細ページです。`
    }
  }
}

export async function generateStaticParams() {
  const ids = await fetchAllBlogId('blog');
  return (ids ?? []).map((id) => ({ postId: id }));
}

export default async function Page({ params, searchParams }: Props) {
  const { postId } = await params;
  const { isEnabled: isDraftMode } = await draftMode();
  const isEnabled = isDraftMode || process.env.NODE_ENV === 'development';
  const { draftKey } = await searchParams;

  const post = isEnabled && draftKey
    ? await fetchBlogDetail('blog', postId, { draftKey })
    : await getBlogDetail(postId);

  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: '投稿', url: `/blog/` },
    { name: post.title, url: `/blog/${post.id}/` },
  ];

  return (
    <>
      {isEnabled && <DraftBanner />}
      <JsonLd data={createArticleJsonLd({
        title: post.title,
        description: `「${post.title}」の記事です。`,
        publishedAt: post.publishedAt ?? '',
        updatedAt: post.updatedAt,
        image: post?.eyecatch?.url ?? `${SITE_URL}/images/blog/dummy.png`,
        url: `${SITE_URL}/blog/${post.id}/`,
      })} />
      <div className={styles.contents}>
        <Breadcrumb data={breadcrumb} />
        <ArticleDetail post={post} />
        <AsideMenu className={styles.aside} />
      </div>
    </>
  )
}
