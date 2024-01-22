import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faClock } from "@fortawesome/free-solid-svg-icons";
import {
  postListWrapper,
  postListEyecatchContainer, postListEyecatch,
  postListTitle,
  postList, postListItem, postListItemLink,
  postData, postDataTitle, postDataDesc, postDateContainer,
  postDateIcon, postDate,
  postBtn
} from './index.css';
import Link from "next/link";
import Image from 'next/image';
import { Blog } from '../../../libs/microcms/blog';
import ConvertDate from "../../../components/common/convertdate";
import { Pagenation } from '../Pagenation';
import { PageTitle } from "../../common/PageTitle";

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
      <PageTitle pageTitle="ブログ" type={{slug: 'blog', ...type}} currentPage={currentPage} />
      {
        hasContents ? 
          <>
            <ul className={postList}>
              {contents.map((post) => {
                const eyecatchPath = `${post.eyecatch?.url}?auto=format&w=768&ar=16:9&fit=crop&q=50`;

                return (
                  <li key={post.id} className={postListItem}>
                    <Link className={postListItemLink} href={`/blog/${post.id}`} scroll={true}>
                      <figure className={postListEyecatchContainer}>
                        {post.eyecatch ?
                          <Image className={postListEyecatch} src={eyecatchPath} alt="" width={post.eyecatch.width} height={post.eyecatch.height} priority={true} /> :
                          <Image className={postListEyecatch} src="/images/blog/dummy.png" alt="" width="375" height="210" priority={true} />
                        }
                      </figure>
                      <dl className={postData}>
                        <dt className={postDataTitle}>{post.title}</dt>
                        <dd className={postDataDesc}>
                          <div className={postDateContainer}>
                            <p className={postDate}>
                              <FontAwesomeIcon className={postDateIcon} icon={faCalendarDay} />公開日：<ConvertDate date={post.publishedAt} />
                            </p>
                            {
                              post.updatedAt &&
                              <p className={postDate}>
                                <FontAwesomeIcon className={postDateIcon} icon={faClock} />更新日：<ConvertDate date={post.updatedAt} />
                              </p>
                            }
                          </div>
                        </dd>
                      </dl>
                      <div className={postBtn}>投稿を読む</div>
                    </Link>
                  </li>
                )
              })}
            </ul>
            <Pagenation pager={{ totalCount, limit, currentPage }} type={type} />
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