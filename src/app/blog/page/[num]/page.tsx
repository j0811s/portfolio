import { getList, getDetail } from "../../../libs/microcms/blog";
import { Breadcrumb } from "@/src/app/components/common/Breadcrumb";
import { ArticleListContents } from "../../../components/blog/ArticleListContents";
import { Metadata, ResolvingMetadata } from 'next';

type generateMetadataProps = {
  params: Promise<{ num: string }>
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const { num } = params;

  return {
    metadataBase: new URL('https://www.jsato1993.com/'),
    title: `${num}ページ | ブログ | J.Sato`,
    description: `「${num}」ページ目`,
    openGraph: {
      description: `「${num}」ページ目`
    }
  }
}


type Props = {
  params: Promise<{
    num: string;
  }>
}

export default async function Page(props: Props) {
  const params = await props.params;
  const { num } = params;
  const limit = 12;

  const { contents, totalCount } = await getList('blog', {
    limit,
    offset: limit * (Number(params.num) - 1)
  });

  return (
    <>
      <ArticleListContents contents={contents} totalCount={totalCount} limit={limit} currentPage={Number(num)} />
    </>
  )
}