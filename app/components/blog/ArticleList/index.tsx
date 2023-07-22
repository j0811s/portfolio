import {
  postListWrapper,
  postListEyecatchContainer, postListEyecatch,
  postListTitle,
  postList, postListItem, postListItemLink,
  postData, postDataTitle, postDataDesc, postDateContainer, postDate,
  postBtn
} from './index.css';
import Link from "next/link";
import Image from 'next/image';
import { Blog } from '../../../libs/microcms';
import ConvertDate from "../../../components/common/convertdate";
import { Pagenation } from '../Pagenation';
import { CtaButton } from '../../common/ctaButton';

type ArticleListParam = {
  contents: Blog[];
  type?: {
    slug?: string;
    id?: string;
    name?: string;
  };
  totalCount: number;
  limit: number;
  currentPage?: number;
}

export const ArticleList = async ({ contents, type, totalCount, limit, currentPage }: ArticleListParam) => {
  const hasContents = totalCount > 0;
  
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
                        <Image className={postListEyecatch} src="/dummy.jpg" alt="" width="375" height="210" />
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
                    <CtaButton modClass={postBtn}>詳細を読む</CtaButton>
                  </Link>
                </li>
              ))}
            </ul>
            <Pagenation pager={{totalCount, limit, currentPage}} type={type} />
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