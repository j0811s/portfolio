import { getList } from "../../../libs/microcms";
import { ArticleList } from "../../../components/blog/ArticleList";
import { Metadata, ResolvingMetadata } from 'next';

type generateMetadataProps = {
  params: { year: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: generateMetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const year = params.year;
  
  return {
    metadataBase: new URL('https://portfolio-doe4gyax2-mormo.vercel.app'),
    title: `${year}年 | ブログ | J.Sato Portfolio`,
    description: `「${year}年」の一覧ページです。`,
    openGraph: {
      description:`「${year}年」の一覧ページです。`
    }
  }
}

type Props = {
  params: {
    year: string;
  };
};

export default async function Page({ params }: Props) {
  const { year } = params;
  
  const { contents } = await getList('blog', {
    filters: `publishedAt[contains]${year}`
  });

  return (<ArticleList contents={contents} type={`${year}年`} />)
}