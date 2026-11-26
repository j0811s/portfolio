import styles from '@/src/features/blog/styles/YearArchive.module.css';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarDays, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';
import { countPostsByYear } from '@/src/libs/blog/countPostsByYear';

function YearArchive({ contents }: { contents: Pick<Blog, 'publishedAt'>[] }) {
  const yearsData = countPostsByYear(contents);
  const years = Object.keys(yearsData).sort((a, b) => Number(b) - Number(a));

  if (years.length === 0) return null;

  return (
    <details className={styles.container} open>
      <summary className={styles.listIetmTitle}>
        <div>
          <FontAwesomeIcon icon={faCalendarDays} size="1x" className={styles.listItemTitleIcon} />
          <span className={styles.listIetmTitleText}>年別アーカイブ</span>
        </div>
        <FontAwesomeIcon
          icon={faChevronDown}
          size="1x"
          className={clsx(styles.listItemTitleIcon, styles.arrowIcon)}
        />
      </summary>
      <ul className={styles.list}>
        {years.map((year) => (
          <li className={styles.listItem} key={year}>
            <Link className={styles.listIetmLink} href={`/blog/archive/${year}`}>
              <span>{year}年</span> <span className={styles.numberBadge}>({yearsData[year]})</span>
            </Link>
          </li>
        ))}
      </ul>
    </details>
  );
}

export default YearArchive;
