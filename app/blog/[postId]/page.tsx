import Image from 'next/image';
import { notFound } from "next/navigation";
import parse from "html-react-parser";
import { getDetail, getList } from "../../libs/microcms";
import { BlogAside } from "../../components/blog/BlogAside";


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
  if (!post) notFound();
  
  return (
    <div className='post'>
      <article id={post.id} className='post-content'>
        <h1 className='post-title'>{post.title}</h1>
        <div className='post-date'>
          <p>公開日：{post.publishedAt}</p>
          { post.updatedAt && <p>更新日：{post.updatedAt}</p> }
        </div>
        {
          post.eyecatch &&
          <figure className='post-eyecatch'>
            <Image src={post.eyecatch.url} alt="" width={post.eyecatch.width} height={post.eyecatch.height} />
          </figure>
        }
        <div className='post-content'>{parse(post.content)}</div>
      </article>
      <BlogAside modClassName='post-aside' />
    </div>
 );
}