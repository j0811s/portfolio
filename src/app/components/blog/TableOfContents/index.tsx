'use client';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronUp, faListUl } from "@fortawesome/free-solid-svg-icons";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { container, titleHead, title, titleIcon, titleLabel, accordionTrigger, accordionTriggerIcon, listContainer, list, listItem, listIetmLink } from "./index.css";
import useMediaQuery from "../../hooks/useMediaQuery";

interface Props extends React.ComponentPropsWithoutRef<'div'> {
  mode?: 'desktop' | 'mobile',
  accordion?: boolean
}

type HeadingProps = {
  [key: string]: string | number | null;
}[]

export const TableOfContents = ({ mode, accordion }: Props) => {
  const pathname = usePathname();
  const tocRef = useRef<HTMLOListElement>(null);
  const postPagePattern = /^\/blog\/[^/]*\/$/;
  const modeOptions = {
    mobile: 'screen and (max-width: 959px)',
    desktop: 'screen and (min-width: 960px)',
  }
  const mediaQuery = mode && modeOptions[mode];
  const isMatches = useMediaQuery(mediaQuery);
  const isDisplayed = mode ? isMatches : true;
  const [isPostPage, setIsPostPage] = useState<boolean>(false);
  const [heading, setHeading] = useState<HeadingProps>([]);
  const [isTocOpen, setIsTocOpen] = useState<boolean>(true);

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

  useEffect(() => {
    const smoothScroll = (e: Event) => {
      e.preventDefault();
      const eventTarget = e.currentTarget;
      if (eventTarget instanceof HTMLAnchorElement) {
        const targetId = eventTarget.getAttribute('href')?.replace(/^#/, "");
        if (!targetId) return;

        const target = document.getElementById(targetId);
        if (!target) return;
        const headerHeight = mode === 'mobile' ? (+document.documentElement.style.getPropertyValue('--headerHeight')) : 0;
        window.scrollTo({
          top: target.offsetTop + headerHeight,
          behavior: "smooth",
        });
      }
    }
    
    tocRef?.current?.querySelectorAll('a').forEach(aTag => {
      aTag.addEventListener('click', smoothScroll);
    });

    return () => {
      tocRef?.current?.querySelectorAll('a').forEach(aTag => {
        aTag.removeEventListener('click', smoothScroll);
      });
    }
  }, [tocRef.current, isMatches]);
  
  return (
    isPostPage &&
    isDisplayed &&
      <div className={container}>
        <div className={titleHead}>
          <h2 className={title}>
            <FontAwesomeIcon icon={faListUl} size="1x" className={titleIcon} />
            <span className={titleLabel}>目次</span>
          </h2>
          {
            accordion &&
            <button className={accordionTrigger} type="button" onClick={() => setIsTocOpen(prev => !prev)}>
              <FontAwesomeIcon className={accordionTriggerIcon} icon={faChevronUp} size="1x" data-open={isTocOpen} />
            </button>
          }
        </div>
        <div className={listContainer} data-open={isTocOpen}>
          <ol className={list} ref={tocRef}>
            {
              heading.map(head => {
                return (
                  <li className={listItem} data-level={head.level} data-index={head.index} key={`${head.id}-${head.index}`}>
                    <a className={listIetmLink} href={`#${(head.id as string)}`} data-level={head.level} data-index={head.index}>
                      <span>{ head.level && +head.level >= 3 ? '・' : ''}{head.text}</span>
                    </a>
                  </li>
                )
              })
            }
          </ol>
        </div>
      </div>
  )
}