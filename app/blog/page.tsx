import { getList, getDetail } from "../libs/microcms";
import { ArticleList } from "../components/blog/ArticleList";

export default async function StaticPage() {
  const limit = 12;

  const { contents, totalCount } = await getList('blog', {
    limit
  });

  return (
    <>
      <ArticleList contents={contents} totalCount={totalCount} limit={limit} />
    </>
  );
}