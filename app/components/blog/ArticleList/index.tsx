import {
  postListContainer, postListWrapper,
  postListEyecatchContainer, postListEyecatch,
  postListTitle,
  postList, postListItem, postListItemLink,
  postData, postDataTitle, postDataDesc, postDateContainer, postDate,
} from './index.css';
import Link from "next/link";
import Image from 'next/image';
import { BlogAside } from "../../../components/blog/BlogAside";
import { Blog } from '../../../libs/microcms';
import ConvertDate from "../../../components/common/convertdate";

export const ArticleList = async ({ contents }: { contents: Blog[] }) => {
  const hasContents = contents.length > 0;

  return (
    <div className={postListContainer}>
      <section className={postListWrapper}>
        <h1 className={postListTitle}>投稿一覧</h1>
        {
          hasContents ? 
            <ul className={postList}>
              {contents.map((post) => (
                <li key={post.id} className={postListItem}>
                  <Link className={postListItemLink} href={`/blog/${post.id}`}>
                    <figure className={postListEyecatchContainer}>
                      {post.eyecatch ?
                        <Image className={postListEyecatch} src={post.eyecatch.url} alt="" width={post.eyecatch.width} height={post.eyecatch.height} /> :
                        <Image className={postListEyecatch} src="https://placehold.jp/750x750.png" alt="" width="750" height="750" />
                      }
                    </figure>
                    <dl className={postData}>
                      <dt className={postDataTitle}>{post.title}</dt>
                      <dd className={postDataDesc}>
                        <div className={postDateContainer}>
                          <p className={postDate}>公開日：<ConvertDate date={post.publishedAt} /></p>
                          { post.updatedAt && <p className={postDate}>更新日：<ConvertDate date={post.updatedAt} /></p> }
                        </div>
                      </dd>
                    </dl>
                  </Link>
                </li>
              ))}
            </ul> :
            <>
            <p>投稿を準備中です。</p>
            <Link href={`/`}>トップページに戻る</Link>
            </>
        }
      </section>
      <BlogAside modClassName="blogList-aside" />
    </div>
  )
}