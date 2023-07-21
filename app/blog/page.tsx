import { getList, getDetail } from "../libs/microcms";
import { BreadcrumbJsonLd } from "../components/common/Breadcrumb/BreadcrumbJsonLd";
import { Breadcrumb } from '../components/common/Breadcrumb';
import { ArticleList } from "../components/blog/ArticleList";

export default async function StaticPage() {
  const limit = 12;

  const { contents, totalCount } = await getList('blog', {
    limit
  });

  return (
    <>
      <BreadcrumbJsonLd type={{slug: 'blog'}} />
      <Breadcrumb type={ {slug: 'blog'} }/>
      <ArticleList contents={contents} totalCount={totalCount} limit={limit} />
    </>
  );
}