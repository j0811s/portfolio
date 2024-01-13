import Link from "next/link";
import Image from "next/image";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faClock } from "@fortawesome/free-solid-svg-icons";

import { container } from "./styles/top/index.css";
import { Blog } from '@/src/app/libs/microcms/blog';
import { getList } from "@/src/app/libs/microcms/blog";
import { getHistoryAllContents, type SkillContent } from "@/src/app/libs/microcms/history"
import ConvertDate from "@/src/app/components/common/convertdate";
import { SkillSet } from "./components/about/SkillSet";

import {
  postListWrapper,
  postListEyecatchContainer, postListEyecatch,
  postListTitle,
  postList, postListItem, postListItemLink,
  postData, postDataTitle, postDataDesc, postDateContainer,
  postDateIcon, postDate,
  postBtn
} from '@/src/app/components/blog/ArticleList/index.css';

export default async function Top() {
  const skillContents: SkillContent[] = await getHistoryAllContents('skill');

  const PortfolioContentsLimit = 6;
  const { contents, totalCount } = await getList('blog', {
    limit: PortfolioContentsLimit
  });

  const PortfolioArticleList = () => {
    
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

  return (
    <>
      <h1>J.Sato | Portfolio Site</h1>
      <section>
        <h2>経験スキル</h2>
        <SkillSet contents={skillContents} />
        <Link href={`/about/`}>もっと見る</Link>
      </section>
      <section>
        <h2>制作物</h2>
        <PortfolioArticleList />
        <Link href={`/blog/categories/portfolio/`}>もっと見る</Link>
      </section>
    </>
  )
}
