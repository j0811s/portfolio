import { getList, getDetail } from "../../../../../libs/microcms/blog";
import { Breadcrumb } from "@/src/app/components/common/Breadcrumb";
import { ArticleListContents } from "../../../../../components/blog/ArticleListContents";
import { Metadata, ResolvingMetadata } from 'next';


type generateMetadataProps = {
  params: Promise<{
    tagId: string;
    num: string;
  }>
}

export async function generateMetadata(props: generateMetadataProps): Promise<Metadata> {
  const params = await props.params;
  const { tagId, num } = params;
  const tag = await getDetail('tags', tagId);

  return {
    metadataBase: new URL('https://www.jsato1993.com/'),
    title: `${num}ページ目 | ${tag?.name} | タグ | ブログ | J.Sato`,
    description: `「${tag?.name}」の${num}ページ目です。`,
    openGraph: {
      description: `「${tag?.name}」の${num}ページ目です。`
    }
  }
}

type Props = {
  params: Promise<{
    tagId: string;
    num: string;
  }>
}

export default async function Page(props: Props) {
  const params = await props.params;
  const { tagId, num } = params;
  const typeName = 'tags';
  const tag = await getDetail(typeName, tagId);
  const limit = 12;

  const { contents, totalCount } = await getList('blog', {
    filters: `tag[contains]${tag.id}`,
    limit,
    offset: limit * (Number(num) - 1)
  });

  const type = {
    slug: typeName,
    id: tag.id,
    name: tag.name
  }

  return (
    <>
      <ArticleListContents contents={contents} type={type} totalCount={totalCount} limit={limit} currentPage={Number(num)} />
    </>
  )
}