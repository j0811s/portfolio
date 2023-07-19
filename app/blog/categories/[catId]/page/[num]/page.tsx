import { getList, getDetail } from "../../../../../libs/microcms";
import { JsonLd } from "@/app/components/common/Breadcrumb/JsonLd";
import { Breadcrumb } from '../../../../../components/common/Breadcrumb';
import { ArticleList } from "../../../../../components/blog/ArticleList";
import { Metadata, ResolvingMetadata } from 'next';


type generateMetadataProps = {
  params: {
    catId: string;
    num: string;
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: generateMetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { catId, num } = params;
  const cat = await getDetail('categories', catId);
  
  return {
    metadataBase: new URL('https://portfolio-doe4gyax2-mormo.vercel.app'),
    title: `${num}ページ目 | ${cat?.name} | カテゴリー | ブログ | J.Sato Portfolio`,
    description: `「${cat?.name}」の${num}ページ目です。`,
    openGraph: {
      description:`「${cat?.name}」の${num}ページ目です。`
    }
  }
}

type Props = {
  params: {
    catId: string;
    num: string;
  }
}

export default async function Page({ params }: Props) {
  const { catId, num } = params;
  const typeName = 'categories';
  const category = await getDetail(typeName, catId);
  const limit = 12;
  
  const { contents, totalCount } = await getList('blog', {
    filters: `category[contains]${category.id}`,
    limit,
    offset: limit * (Number(num) - 1)
  });

  const type = {
    slug: typeName,
    id: category.id,
    name: category.name
  }

  return (
    <>
      <JsonLd type={type} />
      <Breadcrumb type={type} />
      <ArticleList contents={contents} type={type} totalCount={totalCount} limit={limit} currentPage={Number(num)} />
    </>
  )
}