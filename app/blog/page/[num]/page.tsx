import { getList, getDetail } from "../../../libs/microcms";
import { ArticleList } from "../../../components/blog/ArticleList";
import { Metadata, ResolvingMetadata } from 'next';

type generateMetadataProps = {
  params: { num: string }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: generateMetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { num } = params;
  
  return {
    metadataBase: new URL('https://portfolio-doe4gyax2-mormo.vercel.app'),
    title: `${num}ページ | ブログ | J.Sato Portfolio`,
    description: `「${num}」ページ目`,
    openGraph: {
      description:`「${num}」ページ目`
    }
  }
}


type Props = {
  params: {
    num: string;
  }
}

export default async function Page({ params }: Props) {
  const { num } = params;
  const limit = 12;
  
  const { contents, totalCount } = await getList('blog', {
    limit,
    offset: limit * (Number(params.num) - 1)
  });

  return (
    <>
      <ArticleList contents={contents} totalCount={totalCount} limit={limit} currentPage={Number(num)} />
    </>
  )
}