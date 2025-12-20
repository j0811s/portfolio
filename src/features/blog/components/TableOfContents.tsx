import styles from '@/src/features/blog/styles/TableOfContents.module.css';
import { extractTocFromHtml } from '@/src/libs/blog/extractToc';
import { faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
  content?: string;
}

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
      <details className={styles.details}>
        <summary className={styles.title}>目次 <FontAwesomeIcon icon={faChevronDown} size="1x" className={styles.arrowIcon} /></summary>
        <ol className={styles.list}>
          {toc.map((item) => (
            <li
              key={item.id}
              className={styles[`level${item.level}`]}
            >
              <a href={`#${item.id}`}>{item.text}</a>
            </li>
          ))}
        </ol>
      </details>
    </nav>
  )
}
