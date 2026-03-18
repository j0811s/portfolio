import styles from "@/src/styles/pages/blog/layout.module.css";
import { draftMode } from 'next/headers';
import { cookies } from 'next/headers';
import { notFound } from 'next/navigation';
import { SITE_URL } from '@/src/constants/site';
import { Breadcrumb, JsonLd } from '@/src/components';
import { createArticleJsonLd } from '@/src/libs/seo/jsonLd';
import { ArticleDetail, AsideMenu, DraftBanner } from "@/src/features/blog";
import { fetchBlogDetail } from "@/src/libs/microcms/blog";

type Props = {
  params: Promise<{ postId: string }>;
};

export default async function Page({ params }: Props) {
  const { isEnabled } = await draftMode();
  if (!isEnabled && process.env.NODE_ENV !== 'development') notFound();

  const { postId } = await params;
  const cookieStore = await cookies();
  const draftKey = cookieStore.get('draft_key')?.value;

  const post = await fetchBlogDetail('blog', postId, draftKey ? { draftKey } : undefined, { cache: 'no-store' });

  const breadcrumb = [
    { name: 'トップページ', url: SITE_URL },
    { name: '投稿', url: `/blog/` },
    { name: post.title, url: `/blog/${post.id}/` },
  ];

  return (
    <>
      <DraftBanner />
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
