import type { JSX } from "react";
import clsx from "clsx";
import styles from "@/src/features/blog/styles/ArticleDetail.module.css";
import parse, { HTMLReactParserOptions, Element, Text, DOMNode } from "html-react-parser";
import hljs, { AutoHighlightResult } from 'highlight.js';
import 'highlight.js/styles/hybrid.css';
import { Breadcrumb, CtaLinkButton } from "@/src/components";
import { Eyecatch, PublishDate, Tag } from "@/src/features/blog";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

const parseOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (!(domNode instanceof Element && domNode?.attribs)) return undefined

    switch (domNode.name) {
      case 'h1':
      case 'h2':
      case 'h3':
      case 'h4':
      case 'h5':
      case 'h6': {
        domNode.attribs.id = Math.random().toString(36).substring(2, 12);
        break;
      }
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

function ArticleDetail({ post }: { post: Blog }) {
  const eyecatchPath = `${post.eyecatch?.url}?auto=format&w=880&ar=16:9&fit=crop&q=50`;
  const tags: Tag[] = [
    {
      id: "1",
      name: "テスト",
      createdAt: "string;",
      updatedAt: "string;",
    },
    {
      id: "2",
      name: "テスト2",
      createdAt: "string;",
      updatedAt: "string;",
    }
  ];

  return (
    <article id={post.id} className={styles.postWrapper}>
      <div className={styles.postHead}>
        <Breadcrumb currentPage={post.title} />
        <div className={styles.postTextContainer}>
          <h1 className={styles.postTitle}>{post.title}</h1>
          <Eyecatch
            className={styles.postEyecatchContainer}
            src={eyecatchPath}
            width={post.eyecatch?.width}
            height={post.eyecatch?.height}
            isDummy={typeof post.eyecatch?.url === 'undefined'}
          />
          <PublishDate className={styles.date} publishedAt={post.publishedAt} updatedAt={post.updatedAt} />
          {
            <ul className={styles.tags}>
              {
                tags.map(tag => (
                  <li key={tag.name}>
                    <Tag data={tag} totalCount={0} />
                  </li>
                ))
              }
            </ul>
          }
        </div>
      </div>
      <PostContentElement content={post?.content} parseOptions={parseOptions} />
      <div className={styles.backToLink}>
        <CtaLinkButton href="/blog/" prevIcon={true}>一覧へ戻る</CtaLinkButton>
      </div>
    </article>
  )
}

export default ArticleDetail;
