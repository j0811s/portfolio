import { getList, getDetail } from "../../../../../libs/microcms/blog";
import { Breadcrumb } from '../../../../../components/common/Breadcrumb';
import { ArticleListContents } from "../../../../../components/blog/ArticleListContents";
import { Metadata, ResolvingMetadata } from 'next';


type generateMetadataProps = {
  params: Promise<{
    catId: string;
    num: string;
  }>
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const { catId, num } = params;
  const cat = await getDetail('categories', catId);

  return {
    metadataBase: new URL('https://www.jsato1993.com/'),
    title: `${num}ページ目 | ${cat?.name} | カテゴリー | ブログ | J.Sato`,
    description: `「${cat?.name}」の${num}ページ目です。`,
    openGraph: {
      description: `「${cat?.name}」の${num}ページ目です。`
    }
  }
}

type Props = {
  params: Promise<{
    catId: string;
    num: string;
  }>
}

export default async function Page(props: Props) {
  const params = await props.params;
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
      <ArticleListContents contents={contents} type={type} totalCount={totalCount} limit={limit} currentPage={Number(num)} />
    </>
  )
}