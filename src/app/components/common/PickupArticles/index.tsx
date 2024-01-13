import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faClock } from "@fortawesome/free-solid-svg-icons";
import {
  postListEyecatchContainer,
  postListEyecatch,
  postList, postListItem, postListItemLink,
  postData, postDataTitle, postDataDesc, postDateContainer,
  postDateIcon, postDate,
  postBtn
} from './index.css';
import Link from "next/link";
import Image from 'next/image';
import { getList, type Blog } from "@/src/app/libs/microcms/blog";
import ConvertDate from "@/src/app/components/common/convertdate";

export const PickupArticles = async ({ endpoint = 'blog' }: { endpoint: string }) => {
  const { contents, totalCount } = await getList(endpoint, {
    limit: 6
  });

  const hasContents = totalCount > 0;
  
  if (!hasContents) return (
    <div className={postList}>
      <p>投稿を準備中です。</p>
    </div>
  )

  return (
    <ul className={postList}>
      {contents.map((post) => {
        const eyecatchPath = `${post.eyecatch?.url}?fit=fill&w=634&h=356`;
        return (
          <li key={post.id} className={postListItem}>
            <Link className={postListItemLink} href={`/blog/${post.id}`} scroll={true}>
              <figure className={postListEyecatchContainer}>
                {post.eyecatch ?
                  <Image className={postListEyecatch} src={eyecatchPath} alt="" width={post.eyecatch.width} height={post.eyecatch.height} /> :
                  <Image className={postListEyecatch} src="/images/blog/dummy.png" alt="" width="375" height="210" />
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
  )
}