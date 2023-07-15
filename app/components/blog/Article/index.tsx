import {
  postContainer, postWrapper,
  postHead, postEyecatchContainer, postEyecatch, postTextContainer, postTitle, postDateContainer, postDate,
  postContent
} from './index.css';
import Image from 'next/image';
import parse, { HTMLReactParserOptions, Element, Text } from "html-react-parser";
import hljs, { HighlightResult, AutoHighlightResult } from 'highlight.js';
import 'highlight.js/styles/hybrid.css';
import { BlogAside } from "../../../components/blog/BlogAside";
import { Blog } from '../../../libs/microcms';
import ConvertDate from "../../../components/common/convertdate";

export const Article = async ({ post }: { post: Blog }) => {
  
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
  
  return (
    <div className={postContainer}>
      <article id={post.id} className={postWrapper}>
        <div className={postHead}>
          <div className={postTextContainer}>
            <h1 className={postTitle}>{post.title}</h1>
            <div className={postDateContainer}>
              <p className={postDate}>公開日：<ConvertDate date={post.publishedAt} /></p>
              { post.updatedAt && <p className={postDate}>更新日：<ConvertDate date={post.updatedAt} /></p> }
            </div>
          </div>
          <figure className={postEyecatchContainer}>
            {post.eyecatch ?
              <Image className={postEyecatch} src={post.eyecatch.url} alt="" width={post.eyecatch.width} height={post.eyecatch.height} /> :
              <Image className={postEyecatch} src="https://placehold.jp/750x750.png" alt="" width="750" height="750" />
            }
          </figure>
        </div>
        <div className={postContent}>{parse(post.content, parseOptions)}</div>
      </article>
      
      <BlogAside modClassName='post-aside' />
    </div>
  )
}