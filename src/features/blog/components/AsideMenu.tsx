import styles from "@/src/features/blog/styles/AsideMenu.module.css";
import clsx from "clsx";
import { Category, Tag, YearArchive } from "@/src/features/blog";
import { faChevronDown, faListUl, faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ResultPostData } from "@/src/libs/blog/getTotalCount";
import { getTotalCount } from "@/src/libs/blog/getTotalCount";
import { fetchBlogListAll } from "@/src/libs/microcms/blog";

async function AsideMenu({ className = '' }) {
  const contents = await fetchBlogListAll('blog', { fields: 'id,category,tag,publishedAt' });
  const categories: ResultPostData = getTotalCount(contents, 'category');
  const tags: ResultPostData = getTotalCount(contents, 'tag');

  return (
    <aside className={clsx(styles.aside, className)}>
      <details className={styles.container} open>
        <summary className={styles.listIetmTitle}>
          <div>
            <FontAwesomeIcon icon={faListUl} size="1x" className={styles.listItemTitleIcon} />
            <span className={styles.listIetmTitleText}>カテゴリー</span>
          </div>
          <FontAwesomeIcon icon={faChevronDown} size="1x" className={clsx(styles.listItemTitleIcon, styles.arrowIcon)} />
        </summary>
        <ul className={styles.list}>
          {
            Object.keys(categories).map(cat => (
              <li key={categories[cat].name}>
                <Category data={categories[cat]} totalCount={categories[cat].count} />
              </li>
            ))
          }
        </ul>
      </details>
      <details className={styles.container} open>
        <summary className={styles.listIetmTitle}>
          <div>
            <FontAwesomeIcon icon={faTags} className={styles.listItemTitleIcon} />
            <span className={styles.listIetmTitleText}>タグ</span>
          </div>
          <FontAwesomeIcon icon={faChevronDown} size="1x" className={clsx(styles.listItemTitleIcon, styles.arrowIcon)} />
        </summary>
        <ul className={styles.list}>
          {
            Object.keys(tags).map(tag => (
              <li key={tags[tag].name}>
                <Tag data={tags[tag]} totalCount={tags[tag].count} />
              </li>
            ))
          }
        </ul>
      </details>
      <YearArchive contents={contents} />
    </aside>
  )
}

export default AsideMenu;
