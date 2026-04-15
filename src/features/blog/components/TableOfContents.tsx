'use client';

import styles from '@/src/features/blog/styles/TableOfContents.module.css';
import { extractTocFromHtml } from '@/src/libs/blog/extractToc';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  content?: string;
};

const handleScroll = (e: React.MouseEvent<HTMLAnchorElement>) => {
  e.preventDefault();

  const href = e.currentTarget.getAttribute('href');
  if (!href) {
    return;
  }

  const targetId = document.querySelector(href);

  if (targetId) {
    const yOffset = -80;
    const y = targetId.getBoundingClientRect().top + window.pageYOffset + yOffset;

    window.scrollTo({ top: y, behavior: 'smooth' });
  }
};

export default function TableOfContents({ content }: Props) {
  if (!content) {
    return null;
  }

  const toc = extractTocFromHtml(content, {
    minLevel: 2,
    maxLevel: 3,
  });

  if (toc.length === 0) {
    return null;
  }

  return (
    <nav className={styles.toc} aria-label="目次">
      <details className={styles.details} open>
        <summary className={styles.title}>
          目次 <FontAwesomeIcon icon={faChevronDown} size="1x" className={styles.arrowIcon} />
        </summary>
        <ol className={styles.list}>
          {toc.map((item) => (
            <li key={item.id} className={styles[`level${item.level}`]}>
              <a href={`#${item.id}`} onClick={handleScroll}>
                {item.text}
              </a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  );
}
