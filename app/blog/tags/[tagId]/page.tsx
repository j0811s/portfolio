import { getList, getDetail } from "../../../libs/microcms";
import { ArticleList } from "../../../components/blog/ArticleList";
import { Metadata, ResolvingMetadata } from 'next';

type generateMetadataProps = {
  params: { tagId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: generateMetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const tag = await getDetail('tag', params.tagId);
  
  return {
    metadataBase: new URL('https://portfolio-doe4gyax2-mormo.vercel.app'),
    title: `${tag?.name} | ブログ | J.Sato Portfolio`,
    description: `「${tag?.name}」の一覧ページです。`,
    openGraph: {
      description:`「${tag?.name}」の一覧ページです。`
    }
  }
}

type Props = {
  params: {
    tagId: string;
  };
};

export default async function Page({ params }: Props) {
  const { tagId } = params;
  const tag = await getDetail('tag', tagId);
  
  const { contents } = await getList('blog', {
    filters: `tag[contains]${tag.id}`
  });

  return (<ArticleList contents={contents} type={tag.name} />)
}