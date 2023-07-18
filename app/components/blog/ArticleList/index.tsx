import {
  postListWrapper,
  postListEyecatchContainer, postListEyecatch,
  postListTitle,
  postList, postListItem, postListItemLink,
  postData, postDataTitle, postDataDesc, postDateContainer, postDate,
} from './index.css';
import Link from "next/link";
import Image from 'next/image';
import { Blog } from '../../../libs/microcms';
import ConvertDate from "../../../components/common/convertdate";
import { Pagenation } from '../Pagenation';

type ArticleListParam = {
  contents: Blog[];
  type?: {
    slug?: string;
    id?: string;
    name?: string;
  };
  totalCount: number;
  limit: number;
}

export const ArticleList = async ({ contents, type, totalCount, limit }: ArticleListParam) => {
  const hasContents = totalCount > 0;
  const pager: number[] = [...Array(Math.ceil(totalCount / limit)).keys()];
  
  return (
    <section className={postListWrapper}>
      <h1 className={postListTitle}>投稿一覧{type?.name ? `: ${ type.name }` : ''}</h1>
      {
        hasContents ? 
          <>
            <ul className={postList}>
              {contents.map((post) => (
                <li key={post.id} className={postListItem}>
                  <Link className={postListItemLink} href={`/blog/${post.id}`} scroll={true}>
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
            </ul>
            <Pagenation pager={pager} type={type} />
          </>
          :
          <div>
            <p>投稿を準備中です。</p>
            <Link href={`/`}>トップページに戻る</Link>
          </div>
      }
    </section>
  )
}