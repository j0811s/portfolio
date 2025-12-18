import { JsonLd } from '@/src/components';
import { createBreadcrumbJsonLd, createArticleJsonLd } from '@/src/libs/seo/jsonLd';
import { ArticleDetail } from "@/src/features/blog";
import { fetchBlogDetail, fetchBlogList } from "@/src/libs/microcms/blog";
import { Metadata } from 'next';
import { SITE_URL } from '@/src/constants/site';

type generateMetadataProps = {
  params: Promise<{ postId: string }>
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const post = await fetchBlogDetail('blog', params.postId);

  return {
    metadataBase: new URL('https://www.jsato1993.com/'),
    title: `${post?.title} | ブログ | J.Sato`,
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

export default async function Page({ params }: PageProps) {
  const { postId } = await params;
  const post = await fetchBlogDetail('blog', postId);
  
  return (
    <>
      <JsonLd data={createArticleJsonLd({
        title: post.title,
        description: `「${post.title}」の記事です。`,
        publishedAt: post.publishedAt ?? '',
        updatedAt: post.updatedAt,
        image: post?.eyecatch?.url ?? `${SITE_URL}/images/blog/dummy.png`,
        url: `${SITE_URL}/blog/${post.id}/`,
      })} />
      <JsonLd
        data={createBreadcrumbJsonLd([
          { name: 'トップページ', url: SITE_URL },
          { name: '投稿', url: `${SITE_URL}/blog/` },
          { name: post.title, url: `${SITE_URL}/blog/${post.id}/` },
        ])}
      />
      <ArticleDetail post={post} />
    </>
  )
}