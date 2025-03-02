import { getList, getDetail } from "../../../../../libs/microcms/blog";
import { Breadcrumb } from "@/src/app/components/common/Breadcrumb";
import { ArticleListContents } from "../../../../../components/blog/ArticleListContents";
import { Metadata, ResolvingMetadata } from 'next';


type generateMetadataProps = {
  params: Promise<{
    year: string;
    num: string;
  }>
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const { year, num } = params;

  return {
    metadataBase: new URL('https://www.jsato1993.com/'),
    title: `${num}ページ目 | ${year}年 | 年別アーカイブ | ブログ | J.Sato`,
    description: `「${year}年」の${num}ページ目です。`,
    openGraph: {
      description: `「${year}年」の${num}ページ目です。`
    }
  }
}

type Props = {
  params: Promise<{
    year: string;
    num: string;
  }>
}

export default async function Page(props: Props) {
  const params = await props.params;
  const { year, num } = params;
  const limit = 12;

  const { contents, totalCount } = await getList('blog', {
    filters: `publishedAt[contains]${year}`,
    limit,
    offset: limit * (Number(num) - 1)
  });

  const type = {
    slug: 'archive',
    id: year,
    name: `${year}年`
  }

  return (
    <>
      <ArticleListContents contents={contents} type={type} totalCount={totalCount} limit={limit} currentPage={Number(num)} />
    </>
  )
}