import styles from "@/src/features/blog/styles/YearArchive.module.css";
import { client, fetchBlogList } from "@/src/libs/microcms/blog";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays, faChevronDown } from "@fortawesome/free-solid-svg-icons";
import clsx from "clsx";

type YearsData = {
  [key: string]: {
    length: number
  }
}

// ブログ公開日から年別を取得
const createYearsArray = (start: number, end: number) => [...Array(end - start + 1)].map((_, i) => start + i);

const getBlogYears = async () => {
  const newestPost = await client.get({
    endpoint: 'blog',
    queries: { fields: 'publishedAt', orders: '-publishedAt', limit: 1 }
  });
  const newestPostYear = Number(newestPost.contents[0].publishedAt.substr(0, 4));

  const oldestPost = await client.get({
    endpoint: 'blog',
    queries: {
      fields: 'publishedAt',
      orders: 'publishedAt',
      limit: 1
    }
  });
  const oldestPostYear = Number(oldestPost.contents[0].publishedAt.substr(0, 4));

  const postYears = createYearsArray(oldestPostYear, newestPostYear);

  return postYears;
}

async function YearArchive() {
  const years = await getBlogYears();
  if (years.length === 0) return;

  const yearsData: YearsData = {};
  
  await Promise.all(years.map(async year => {
    const { contents } = await fetchBlogList('blog', {
      offset: 0,
      limit: 100,
      filters: `publishedAt[contains]${year}`
    })

    yearsData[year] = {
      length: contents.length
    }
  }));
  
  return (
    <details className={styles.container} open>
      <summary className={styles.listIetmTitle}>
        <div>
          <FontAwesomeIcon icon={faCalendarDays} size="1x" className={styles.listItemTitleIcon} />
          <span className={styles.listIetmTitleText}>年別アーカイブ</span>
        </div>
        <FontAwesomeIcon icon={faChevronDown} size="1x" className={clsx(styles.listItemTitleIcon, styles.arrowIcon)} />
      </summary>
      <ul className={styles.list}>
        {years.map(year => (
          <li className={styles.listItem} key={year}>
            <Link className={styles.listIetmLink} href={`/blog/archive/${year}`}>
              <span>{year}年</span> <span className={styles.numberBadge}>({yearsData[year].length})</span>
            </Link>
          </li>
        ))}
      </ul>
    </details>
  )
}

export default YearArchive;
