import { getList, getDetail } from "../../../libs/microcms";
import { ArticleList } from "../../../components/blog/ArticleList";
import { Metadata, ResolvingMetadata } from 'next';

type generateMetadataProps = {
  params: { catId: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: generateMetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const cat = await getDetail('categories', params.catId);
  
  return {
    metadataBase: new URL('https://portfolio-doe4gyax2-mormo.vercel.app'),
    title: `${cat?.name} | ブログ | J.Sato Portfolio`,
    description: `「${cat?.name}」の一覧ページです。`,
    openGraph: {
      description:`「${cat?.name}」の一覧ページです。`
    }
  }
}

type Props = {
  params: {
    catId: string;
  };
};

export default async function Page({ params }: Props) {
  const { catId } = params;
  const category = await getDetail('categories', catId);
  
  const { contents } = await getList('blog', {
    filters: `category[contains]${category.id}`
  });

  return (<ArticleList contents={contents} type={category.name} />)
}