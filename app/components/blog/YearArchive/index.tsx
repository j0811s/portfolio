import Link from "next/link";
import { client } from "../../../libs/microcms";


// ブログの年別を取得
const createYearsArray = (start: number, end: number) => [...Array(end - start + 1)].map((_, i) => start + i);
const getBlogYears = async () => {
  const newestPost = await client.get({
    endpoint: 'blog',
    queries: { fields: 'createdAt', orders: '-createdAt', limit: 1 }
  });
  const newestPostYear = Number(newestPost.contents[0].createdAt.substr(0, 4));

  const oldestPost = await client.get({
    endpoint: 'blog',
    queries: { fields: 'createdAt', orders: 'createdAt', limit: 1 }
  });
  const oldestPostYear = Number(oldestPost.contents[0].createdAt.substr(0, 4));

  const postYears = createYearsArray(oldestPostYear, newestPostYear);

  return postYears;
}


export const YearArchive = async () => {
  const years = await getBlogYears();
  
  return (
    <div className='yearArchive'>
      <h2>年別アーカイブ</h2>
      <ul>
        {years.map(year => (
          <li key={year}>
            <Link href={`/blog/archive/${year}`}>{year}年</Link>
          </li>
        ))}
      </ul>
    </div>
  )
}