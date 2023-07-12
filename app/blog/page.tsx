import Link from "next/link";
import { getList, getDetail } from "../libs/microcms";
import { BlogAside } from "../components/blog/BlogAside";


export default async function StaticPage() {
  const { contents } = await getList('blog');
  const hasContents = contents.length > 0;

  return (
    <div className="blogList">
      <section className="blogList-content">
        <h1>投稿一覧</h1>
        {
          hasContents ? 
            <ul>
              {contents.map((post) => {
              return (
                <li key={post.id}>
                <Link href={`/blog/${post.id}`}>{post.title}</Link>
                </li>
              );
              })}
            </ul> :
            <>
            <p>投稿を準備中です。</p>
            <Link href={`/`}>トップページに戻る</Link>
            </>
        }
      </section>
      <BlogAside modClassName="blogList-aside" />
    </div>
  );
}