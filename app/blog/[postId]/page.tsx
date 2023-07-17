import { getDetail, getList } from "../../libs/microcms";
import { Article } from '../../components/blog/Article';
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


export default async function StaticDetailPage(
  { params: { endpoint, postId } }: { params: { endpoint: string, postId: string }; }
) {
  const post = await getDetail(endpoint, postId);
  return <Article post={post} />;
}