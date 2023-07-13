import { getDetail, getList } from "../../libs/microcms";
import { Article } from '../../components/blog/Article';


export async function generateStaticParams() {
  const { contents } = await getList('blog');
  const paths = contents.map((post) => {
    return {
      endpoint: post.endpoint,
      postId: post.id
    };
  });

  return [...paths];
}


export default async function StaticDetailPage(
  { params: { endpoint, postId } }: { params: { endpoint: string, postId: string }; }
) {
  const post = await getDetail(endpoint, postId);
  return <Article post={post} />;
}