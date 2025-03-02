import { getList, getDetail } from "../../../libs/microcms/blog";
import { Breadcrumb } from "@/src/app/components/common/Breadcrumb";
import { ArticleListContents } from "../../../components/blog/ArticleListContents";
import { Metadata, ResolvingMetadata } from 'next';

type generateMetadataProps = {
  params: Promise<{ catId: string }>
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const cat = await getDetail('categories', params.catId);

  return {
    metadataBase: new URL('https://www.jsato1993.com/'),
    title: `${cat?.name} | カテゴリー | ブログ | J.Sato`,
    description: `「${cat?.name}」の一覧ページです。`,
    openGraph: {
      description: `「${cat?.name}」の一覧ページです。`
    }
  }
}

type Props = {
  params: Promise<{
    catId: string;
  }>;
};

export default async function Page(props: Props) {
  const params = await props.params;
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

  return (
    <>
      <ArticleListContents contents={contents} type={type} totalCount={totalCount} limit={limit} />
    </>
  )
}