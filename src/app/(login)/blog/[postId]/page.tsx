import styles from "@/src/styles/pages/blog/layout.module.css";
import { Metadata } from 'next';
import { draftMode } from 'next/headers';
import { SITE_URL } from '@/src/constants/site';
import { Breadcrumb, JsonLd } from '@/src/components';
import { createArticleJsonLd } from '@/src/libs/seo/jsonLd';
import { ArticleDetail, AsideMenu, DraftBanner } from "@/src/features/blog";
import { fetchBlogDetail, fetchBlogList } from "@/src/libs/microcms/blog";
import { metadata as rootMetadata } from '@/src/app/layout';

// export const revalidate = 3600;

type Props = {
  params: Promise<{ postId: string }>;
  searchParams: Promise<{ draftKey?: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { postId } = await params;
  const post = await fetchBlogDetail('blog', postId);

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
  const { contents } = await fetchBlogList('blog');
  const paths = contents.map((post) => {
    return {
      endpoint: post.endpoint,
      postId: post.id
    };
  });

  return [...paths];
}

export default async function Page({ params, searchParams }: Props) {
  const { postId } = await params;
  const { isEnabled } = await draftMode();
  const { draftKey } = await searchParams;

  const post = await fetchBlogDetail(
    'blog',
    postId,
    isEnabled && draftKey ? { draftKey } : undefined
  );

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
