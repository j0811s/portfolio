import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDay, faClock } from "@fortawesome/free-solid-svg-icons";
import {
  postWrapper,
  postHead, postEyecatchContainer, postTextContainer, postTitle, postDateContainer,
  postDate, postDateIcon,
  postContent,
  prevButton,
} from './index.css';
import parse, { HTMLReactParserOptions, Element, Text } from "html-react-parser";
import hljs, { AutoHighlightResult } from 'highlight.js';
import 'highlight.js/styles/hybrid.css';
import { Blog, Tag } from '../../../libs/microcms/blog';
import ConvertDate from "../../../components/common/convertdate";
import { TagsElement } from '../Tags/TagsElement';
import { Breadcrumb } from "../../common/Breadcrumb";
import { CtaButton } from "../../common/Button";
import { Thumbnail } from "../Thumbnail";
  
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
  const type = {
    slug: 'post',
    id: post.id,
    name: post.title
  }
  const eyecatchPath = `${post.eyecatch?.url}?auto=format&w=880&ar=16:9&fit=crop&q=50`;
  
  return (
    <article id={post.id} className={postWrapper}>
      <div className={postHead}>
        <Breadcrumb type={type} post={post} />
        <div className={postTextContainer}>
          <h1 className={postTitle}>{post.title}</h1>
          <TagsElement tagData={tag} modClass={{ul: 'mod-gapNoneX', li: ''}} />
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
        <Thumbnail className={postEyecatchContainer} src={eyecatchPath} width={post.eyecatch?.width} height={post.eyecatch?.height} isDummy={typeof post.eyecatch?.url === 'undefined'} />
      </div>
      <PostContentElement content={post?.content} parseOptions={parseOptions} />
      <div className={prevButton}>
        <CtaButton href="/blog/" prev={true}>一覧へ戻る</CtaButton>
      </div>
    </article>
  )
}