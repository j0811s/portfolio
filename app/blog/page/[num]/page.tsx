import { getList, getDetail } from "../../../libs/microcms";
import { ArticleList } from "../../../components/blog/ArticleList";
import { Metadata, ResolvingMetadata } from 'next';

// type generateMetadataProps = {
//   params: { id: string }
//   searchParams: { [key: string]: string | string[] | undefined }
// }

// export async function generateMetadata(
//   { params, searchParams }: generateMetadataProps,
//   parent: ResolvingMetadata
// ): Promise<Metadata> {
//   const tag = await getDetail('tag', params.id);
  
//   return {
//     metadataBase: new URL('https://portfolio-doe4gyax2-mormo.vercel.app'),
//     title: `${tag?.name}ページ | ブログ | J.Sato Portfolio`,
//     description: `「${tag?.name}」ページ目`,
//     openGraph: {
//       description:`「${tag?.name}」ページ目`
//     }
//   }
// }


type Props = {
  params: {
    num: string;
    category: string;
    product: string;
  }
}

export async function generateStaticParams() {
  const { contents, totalCount } = await getList('blog');

  const paths = contents.map((post) => {
    return {
      endpoint: post.endpoint,
      postId: post.id,
      totalCount
    };
  });

  return [...paths];
}

export default async function Page({ params }: Props) {
  // const { num } = params;
  // const data = await getDetail("tag", num);
  // const limit = 12;

  console.log(params)
  
  // const { contents, totalCount } = await getList('blog', {
  //   filters: `${"tag"}[contains]${data.id}`,
  //   limit
  // });

  return (
    <>
      <h2>{ params.num }</h2>
      {/* <ArticleList contents={contents} type={data.name} totalCount={totalCount} limit={limit} /> */}
    </>
  )
}