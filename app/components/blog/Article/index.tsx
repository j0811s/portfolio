import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faClock } from "@fortawesome/free-solid-svg-icons";
import {
  postWrapper,
  postHead, postEyecatchContainer, postEyecatch, postTextContainer, postTitle, postDateContainer,
  postDate, postDateIcon,
  postContent
} from './index.css';
import Image from 'next/image';
import parse, { HTMLReactParserOptions, Element, Text } from "html-react-parser";
import hljs, { AutoHighlightResult } from 'highlight.js';
import 'highlight.js/styles/hybrid.css';
import { Blog, Tag } from '../../../libs/microcms';
import ConvertDate from "../../../components/common/convertdate";
import { TagsElement } from '../Tags/TagsElement';
  
const parseOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (!(domNode instanceof Element && domNode?.attribs)) return undefined

    if (domNode.name === 'pre') {
      const code: string = ((domNode.children[0] as Element).children[0] as Text).data // https://github.com/remarkablemark/html-react-parser/issues/591
      const highlightCode: AutoHighlightResult = hljs.highlightAuto(code)
      
      return (
        <pre>
          <code className="hljs">{parse(highlightCode.value)}</code>
        </pre>
      )
    }
  },
}

const PostContentElement = ({content = '', parseOptions}: {content: string, parseOptions: HTMLReactParserOptions}): JSX.Element => {
  return content !== '' ? <div className={postContent}>{parse(content, parseOptions)}</div> : <></>;
}

export const Article = async ({ post }: { post: Blog }) => {
  const { tag }: { tag: Tag[] } = post;
  
  return (
    <article id={post.id} className={postWrapper}>
      <div className={postHead}>
        <div className={postTextContainer}>
          <h1 className={postTitle}>{post.title}</h1>
          <TagsElement tagData={tag} modClass={{ul: '', li: ''}} />
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
        </div>
        <figure className={postEyecatchContainer}>
          {post.eyecatch ?
            <Image className={postEyecatch} src={post.eyecatch.url} alt="" width={post.eyecatch.width} height={post.eyecatch.height} /> :
            <Image className={postEyecatch} src="/images/blog/dummy_lg.png" alt="" width="375" height="210" />
          }
        </figure>
      </div>
      <PostContentElement content={post?.content} parseOptions={parseOptions} />
    </article>
  )
}