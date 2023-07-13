import {
  postContainer, postWrapper,
  postHead, postEyecatchContainer, postEyecatch, postTextContainer, postTitle, postDateContainer, postDate,
  postContent
} from './index.css';
import Image from 'next/image';
import parse from "html-react-parser";
import { BlogAside } from "../../../components/blog/BlogAside";
import { Blog } from '../../../libs/microcms';

export const Article = async ({post}: {post: Blog}) => {
  
  return (
    <div className={postContainer}>
      <article id={post.id} className={postWrapper}>
        <div className={postHead}>
          <figure className={postEyecatchContainer}>
            {post.eyecatch ?
              <Image className={postEyecatch} src={post.eyecatch.url} alt="" width={post.eyecatch.width} height={post.eyecatch.height} /> :
              <Image className={postEyecatch} src="https://placehold.jp/750x750.png" alt="" width="750" height="750" />
            }
          </figure>
          <div className={postTextContainer}>
            <h1 className={postTitle}>{post.title}</h1>
            <div className={postDateContainer}>
              <p className={postDate}>公開日：{post.publishedAt}</p>
              { post.updatedAt && <p className={postDate}>更新日：{post.updatedAt}</p> }
            </div>
          </div>
        </div>
        <div className={postContent}>{parse(post.content)}</div>
      </article>
      
      <BlogAside modClassName='post-aside' />
    </div>
  )
}