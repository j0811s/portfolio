import { getList } from "../libs/microcms/blog";
import { ArticleListContents } from "../components/blog/ArticleListContents";

export default async function StaticPage() {
  const limit = 12;
  const { contents, totalCount } = await getList('blog', { limit });

  return <ArticleListContents contents={contents} totalCount={totalCount} limit={limit} />;
}