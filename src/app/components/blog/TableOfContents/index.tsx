'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { container, title, titleIcon, titleLabel, list, listItem, listIetmLink } from "./index.css";
import useMediaQuery from "../../hooks/useMediaQuery";

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  mode?: 'desktop' | 'mobile',
}

type HeadingProps = {
  [key: string]: string | number | null
}[]

export const TableOfContents = ({ mode }: Props) => {
  const pathname = usePathname();
  const postPagePattern = /^\/blog\/.*\/$/;
  const modeOptions = {
    mobile: 'screen and (max-width: 959px)',
    desktop: 'screen and (min-width: 960px)',
  }
  const isMatches = mode ? useMediaQuery(modeOptions[mode]) : true;
  const [isPostPage, setIsPostPage] = useState<boolean>(false);
  const [heading, setHeading] = useState<HeadingProps>([]);


  useEffect(() => {
    setIsPostPage(postPagePattern.test(pathname));
  }, [pathname]);

  useEffect(() => {
    if (!isPostPage) return;

    const postContents = document.getElementById('js-postContents');
    const headings = postContents?.querySelectorAll('h1, h2, h3, h4, h5, h6');
    if (!headings?.length) return;
    
    const headData = [...headings].map((heading, i) => {
      const level = heading.tagName.match(/\d/);
      return {
        id: String(heading.id),
        index: i,
        level: level ? level[0] : '',
        text: heading.textContent ? heading.textContent : ''
      }
    });

    setHeading(headData);
  }, [isPostPage]);
  
  return (
    isPostPage && isMatches &&
    <div className={container}>
      <h2 className={title}>
        <FontAwesomeIcon icon={faListUl} size="1x" className={titleIcon} />
        <span className={titleLabel}>目次</span>
      </h2>
      <ol className={list}>
        {
          heading.map(head => {
            return (
              <li className={listItem} data-level={head.level} data-index={head.index} key={head.id}>
                <a className={listIetmLink} href={`#${(head.id as string)}`}>・{ head.text }</a>
              </li>
            )
          })
        }
      </ol>
    </div>
  )
}