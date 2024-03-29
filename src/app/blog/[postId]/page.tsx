import { getDetail, getList } from "../../libs/microcms/blog";
import { Breadcrumb } from "@/src/app/components/common/Breadcrumb";
import { Article } from '@/src/app/components/blog/Article';
import { Metadata, ResolvingMetadata } from 'next';

type generateMetadataProps = {
  params: { postId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: generateMetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const post = await getDetail('blog', params.postId);
  
  return {
    metadataBase: new URL('https://www.jsato1993.com/'),
    title: `${post?.title} | ブログ | J.Sato`,
    description: `「${post?.title}」の詳細ページです。`,
    openGraph: {
      description:`「${post?.title}」の詳細ページです。`
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
  params: {
    endpoint: string;
    postId: string;
  }
}

export default async function StaticDetailPage({ params: { endpoint, postId } }: StaticDetailPage) {
  const post = await getDetail(endpoint, postId);

  return (
    <>
      <Article post={post} />
    </>
  )
}