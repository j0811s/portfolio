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
    title: `${cat?.name} | カテゴリー | ブログ | J.Sato Portfolio`,
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
  const typeName = 'categories';
  const category = await getDetail(typeName, catId);
  const limit = 12;
  
  const { contents, totalCount } = await getList('blog', {
    filters: `category[contains]${category.id}`,
    limit
  });

  const type = {
    slug: typeName,
    id: category.id,
    name: category.name
  }

  return (<ArticleList contents={contents} type={type} totalCount={totalCount} limit={limit} />)
}