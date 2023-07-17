import { container, list, listItem, listIetmLink } from "./index.css";
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
    queries: { fields: 'publishedAt', orders: 'publishedAt', limit: 1 }
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
      limit: 1000,
      filters: `publishedAt[contains]${year}`
    })

    yearsData[year] = {
      length: contents.length
    }
  }));
  
  return (
    <div className={container}>
      <h2>年別アーカイブ</h2>
      <ul className={list}>
        {years.map(year => (
          <li className={listItem} key={year}>
            <Link className={listIetmLink} href={`/blog/archive/${year}`}>{year}年 ({yearsData[year].length})</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}