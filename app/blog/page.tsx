import { getList, getDetail } from "../libs/microcms";
import { ArticleList } from "../components/blog/ArticleList";

export default async function StaticPage() {
  const { contents } = await getList('blog');
  
  return (
    <>
      <ArticleList contents={contents} />
    </>
  );
}