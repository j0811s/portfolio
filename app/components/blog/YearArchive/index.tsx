import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarDays } from "@fortawesome/free-solid-svg-icons";
import { container, list, listItem, listIetmLink, listIetmTitle, listItemTitleIcon, listIetmTitleText, numberBadge } from "./index.css";
import Link from "next/link";
import { client, getList } from "../../../libs/microcms";


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

type YearsData = {
  [key: string]: {
    length: number
  }
}

export const YearArchive = async () => {
  const years = await getBlogYears();
  if (years.length === 0) return;

  const yearsData: YearsData = {};
  
  await Promise.all(years.map(async year => {
    const { contents } = await getList('blog', {
      offset: 0,
      limit: 1000,
      filters: `publishedAt[contains]${year}`
    })

    yearsData[year] = {
      length: contents.length
    }
  }));
  
  return (
    <div className={container}>
      <h2 className={listIetmTitle}>
        <FontAwesomeIcon icon={faCalendarDays} size="1x" className={listItemTitleIcon} />
        <span className={listIetmTitleText}>年別アーカイブ</span>
      </h2>
      <ul className={list}>
        {years.map(year => (
          <li className={listItem} key={year}>
            <Link className={listIetmLink} href={`/blog/archive/${year}`}>
              <span>{year}年</span> <span className={numberBadge}>{yearsData[year].length}</span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}