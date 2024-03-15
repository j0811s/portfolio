'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useEffect, useState } from "react";
import { container, title, titleIcon, titleLabel, list, listItem, listIetmLink } from "./index.css";

type Props = {
  [key: string]: string | number | null
}[]

export const TableOfContents = () => {
  const pathname = usePathname();
  const postPagePattern = /^\/blog\/.*\/$/;
  const [isPostPage, setIsPostPage] = useState<boolean>(false);
  const [heading, setHeading] = useState<Props>([]);

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
    isPostPage &&
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
                <Link className={listIetmLink} href={`#${(head.id as string)}`}>・{ head.text }</Link>
              </li>
            )
          })
        }
      </ol>
    </div>
  )
}