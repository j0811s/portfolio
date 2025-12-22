import styles from "@/src/features/blog/styles/ArticleDetail.module.css";
import type { JSX } from "react";
import clsx from "clsx";
import parse, { HTMLReactParserOptions, Element, Text, DOMNode } from "html-react-parser";
import hljs, { AutoHighlightResult } from 'highlight.js';
import { CtaLinkButton } from "@/src/components";
import { Eyecatch, PublishDate, TableOfContents, Tag } from "@/src/features/blog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";
import { fetchBlogDetail } from "@/src/libs/microcms/blog";
import type { ResultPostData } from "@/src/libs/blog/getTotalCount";
import { getTotalCount } from "@/src/libs/blog/getTotalCount";

const parseOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (!(domNode instanceof Element && domNode?.attribs)) return undefined

    switch (domNode.name) {
      case 'pre': {
        const fileName: string = (domNode.parent as Element)?.attribs['data-filename'] !== '' ? (domNode.parent as Element)?.attribs['data-filename'] : '';
        const code: string = ((domNode.children[0] as Element).children[0] as Text).data; // https://github.com/remarkablemark/html-react-parser/issues/591
        const highlightCode: AutoHighlightResult = hljs.highlightAuto(code);

        return (
          <div className={styles.codeBlock}>
            {
              fileName &&
              <div className={clsx(styles.fileName, 'hljs')}>
                <FontAwesomeIcon icon={faCode} /> {fileName}
              </div>
            }
            <pre className={styles['codeBlock_pre']}>
              <code className={clsx(styles['codeBlock_code'], 'hljs')}>
                {parse(highlightCode.value)}
              </code>
            </pre>
          </div>
        )
      }
      default: {
        break;
      }
    }
  }
}

const PostContentElement = ({content = '', parseOptions}: {content: string, parseOptions: HTMLReactParserOptions}): JSX.Element => {
  return content !== '' ? <div id="js-postContents" className={styles.postContent}>{parse(content, parseOptions)}</div> : <></>;
}

async function ArticleDetail({ post }: { post: Blog }) {
  const contents = await fetchBlogDetail('blog', post.id);
  const tags: ResultPostData = getTotalCount([contents], 'tag');
  const eyecatchPath = typeof post.eyecatch?.url === 'undefined' ? undefined : `${post.eyecatch.url}?auto=format&w=880&ar=16:9&fit=crop&q=50`;

  return (
    <article id={post.id} className={styles.postWrapper}>
      <div className={styles.postHead}>
        <div className={styles.postTextContainer}>
          <Eyecatch
            className={styles.postEyecatchContainer}
            src={eyecatchPath}
            width={post.eyecatch?.width}
            height={post.eyecatch?.height}
          />
          <h1 className={styles.postTitle}>{post.title}</h1>
          <PublishDate className={styles.date} publishedAt={post.publishedAt} updatedAt={post.updatedAt} />
          {
            <ul className={styles.tags}>
              {
                Object.keys(tags).map(tag => (
                  <li key={tags[tag].name}>
                    <Tag data={tags[tag]} totalCount={tags[tag].count} />
                  </li>
                ))
              }
            </ul>
          }
        </div>
      </div>
      <TableOfContents content={post?.content} />
      <PostContentElement content={post?.content} parseOptions={parseOptions} />
      <div className={styles.backToLink}>
        <CtaLinkButton href="/blog/" prevIcon={true}>一覧へ戻る</CtaLinkButton>
      </div>
    </article>
  )
}

export default ArticleDetail;
