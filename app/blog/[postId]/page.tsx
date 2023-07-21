import { getDetail, getList } from "../../libs/microcms";
import { Breadcrumb } from "@/app/components/common/Breadcrumb";
import { Article } from '@/app/components/blog/Article';
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
    metadataBase: new URL('https://portfolio-doe4gyax2-mormo.vercel.app'),
    title: `${post?.title} | ブログ | J.Sato Portfolio`,
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

  const type = {
    slug: 'post',
    id: post.id,
    name: post.title
  }

  return (
    <>
      <Breadcrumb type={type} post={post} />
      <Article post={post} />
    </>
  )
}