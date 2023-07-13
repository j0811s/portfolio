import Image from 'next/image';
import parse from "html-react-parser";
import { BlogAside } from "../../../components/blog/BlogAside";
import { Blog } from '../../../libs/microcms';

export const Article = async ({post}: {post: Blog}) => {
  
  return (
    <div className='post'>
      <article id={post.id} className='post-content'>
        <div className='post-head'>
          <figure className='post-eyecatch'>
            {post.eyecatch ?
              <Image src={post.eyecatch.url} alt="" width={post.eyecatch.width} height={post.eyecatch.height} /> :
              <Image src="https://placehold.jp/750x750.png" alt="" width="750" height="750" />
            }
          </figure>
          <div className='post-head_textContent'>
            <h1 className='post-title'>{post.title}</h1>
            <div className='post-date'>
              <p>公開日：{post.publishedAt}</p>
              { post.updatedAt && <p>更新日：{post.updatedAt}</p> }
            </div>
          </div>
        </div>
        <div className='post-content'>{parse(post.content)}</div>
      </article>
      
      <BlogAside modClassName='post-aside' />
    </div>
  )
}