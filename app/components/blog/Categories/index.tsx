import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faListUl } from "@fortawesome/free-solid-svg-icons";
import { container, list, listItem, listIetmLink, listIetmTitle, listItemTitleIcon, listIetmTitleText, numberBadge } from "./index.css";
import Link from "next/link";
import { getList } from "../../../libs/microcms";
import { GetTotalCount } from "../totalCount";

export const Categories = async () => {
  const { contents } = await getList('blog', {
    offset: 0,
    limit: 1000
  });
  
  if (contents.length === 0) return;

  const categoriesData = GetTotalCount(contents, 'category');
  const categories = Object.keys(categoriesData).sort((a, b) => (a < b ? -1 : 1));

  return (
    <div className={container}>
      <h2 className={listIetmTitle}>
        <FontAwesomeIcon icon={faListUl} size="1x" className={listItemTitleIcon} />
        <span className={listIetmTitleText}>カテゴリー</span>
      </h2>
      <ul className={list}>
        {
          categories.map(cat => <li className={listItem} key={cat}>{
            <Link className={listIetmLink} href={`/blog/categories/${cat}`}>
              <span>{categoriesData[cat].name}</span> <span className={numberBadge}>{categoriesData[cat].count}</span>
            </Link>
          }</li>)
        }
      </ul>
    </div>
  )
}