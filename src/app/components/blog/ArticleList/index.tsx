import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faClock } from "@fortawesome/free-solid-svg-icons";
import {
  postList, postListItem, postListItemLink,
  postData, postDataTitle, postDataDesc, postDateContainer,
  postDateIcon, postDate,
  postBtn
} from './index.css';
import Link from "next/link";
import ConvertDate from "@/src/app/components/common/convertdate";
import { Thumbnail } from "@/src/app/components/blog/Thumbnail";

export const ArticleList = ({ contents, totalCount }: { contents: any[], totalCount: number }) => {
  const hasContents = totalCount > 0;
  
  if (!hasContents) return (
    <div className={postList}>
      <p>投稿を準備中です。</p>
    </div>
  )

  return (
    <ul className={postList}>
      {
        contents.map((post) => {
          const eyecatchPath = `${post.eyecatch?.url}?fit=fill?auto=format&w=768&ar=16:9&fit=crop&q=50`;
          return (
            <li key={post.id} className={postListItem}>
              <Link className={postListItemLink} href={`/blog/${post.id}`} scroll={true}>
                <Thumbnail isDummy={typeof post.eyecatch?.url === 'undefined'} src={eyecatchPath} width={post.eyecatch?.width} height={post.eyecatch?.height} />
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
        })
      }
    </ul>
  )
}