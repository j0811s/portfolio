import { getList, getDetail } from "../../../../../libs/microcms/blog";
import { Breadcrumb } from "@/src/app/components/common/Breadcrumb";
import { ArticleList } from "../../../../../components/blog/ArticleList";
import { Metadata, ResolvingMetadata } from 'next';


type generateMetadataProps = {
  params: {
    year: string;
    num: string;
  }
  searchParams: { [key: string]: string | string[] | undefined }
}

export async function generateMetadata(
  { params, searchParams }: generateMetadataProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const { year, num } = params;
  
  return {
    metadataBase: new URL('https://portfolio-doe4gyax2-mormo.vercel.app'),
    title: `${num}ページ目 | ${year}年 | 年別アーカイブ | ブログ | J.Sato`,
    description: `「${year}年」の${num}ページ目です。`,
    openGraph: {
      description: `「${year}年」の${num}ページ目です。`
    }
  }
}

type Props = {
  params: {
    year: string;
    num: string;
  }
}

export default async function Page({ params }: Props) {
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
      <ArticleList contents={contents} type={type} totalCount={totalCount} limit={limit} currentPage={Number(num)} />
    </>
  )
}