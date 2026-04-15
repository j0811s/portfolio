import styles from '@/src/styles/pages/blog/layout.module.css';
import type { Metadata } from 'next';
import { cache } from 'react';
import { SITE_URL } from '@/src/constants/site';
import { Breadcrumb, JsonLd } from '@/src/components';
import { createArticleJsonLd } from '@/src/libs/seo/jsonLd';
import { ArticleDetail, AsideMenu } from '@/src/features/blog';
import { fetchAllBlogId, fetchBlogDetail } from '@/src/libs/microcms/blog';
import { metadata as rootMetadata } from '@/src/app/layout';

export const revalidate = 3600;

const getBlogDetail = cache((postId: string) => fetchBlogDetail('blog', postId));

type Props = {
  params: Promise<{ postId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const post = await getBlogDetail(postId);

  return {
    ...rootMetadata,
    title: `${post?.title} | 投稿`,
    description: `「${post?.title}」の詳細ページです。`,
    openGraph: {
      description: `「${post?.title}」の詳細ページです。`,
    },
  };
}

export async function generateStaticParams() {
  const ids = await fetchAllBlogId('blog');
  return (ids ?? []).map((id) => ({ postId: id }));
}

export default async function Page({ params }: Props) {
  const { postId } = await params;
  const post = await getBlogDetail(postId);

  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: '投稿', url: `/blog/` },
    { name: post.title, url: `/blog/${post.id}/` },
  ];

  return (
    <>
      <JsonLd
        data={createArticleJsonLd({
          title: post.title,
          description: `「${post.title}」の記事です。`,
          publishedAt: post.publishedAt ?? '',
          updatedAt: post.updatedAt,
          image: post?.eyecatch?.url ?? `${SITE_URL}/images/blog/dummy.png`,
          url: `${SITE_URL}/blog/${post.id}/`,
        })}
      />
      <div className={styles.contents}>
        <Breadcrumb data={breadcrumb} />
        <ArticleDetail post={post} />
        <AsideMenu className={styles.aside} />
      </div>
    </>
  );
}
