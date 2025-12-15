import { getDetail, getList } from "../../libs/microcms/blog";
import { ArticleDetail } from "@/src/features/blog";
import { Metadata } from 'next';

type generateMetadataProps = {
  params: Promise<{ postId: string }>
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const post = await getDetail('blog', params.postId);

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
  const { contents } = await getList('blog');
  const paths = contents.map((post) => {
    return {
      endpoint: post.endpoint,
      postId: post.id
    };
  });

  return [...paths];
}

type StaticDetailPage = {
  params: Promise<{
    endpoint: string;
    postId: string;
  }>
}

export default async function StaticDetailPage(props: StaticDetailPage) {
  const params = await props.params;

  const {
    endpoint,
    postId
  } = params;

  const post = await getDetail(endpoint, postId);

  return <ArticleDetail post={post} />
}