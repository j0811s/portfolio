import styles from "@/src/features/blog/styles/AsideMenu.module.css";
import { Category, Tag, YearArchive } from "@/src/features/blog";
import { faListUl, faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import type { ResultPostData } from "@/src/libs/blog/getTotalCount";
import { getTotalCount } from "@/src/libs/blog/getTotalCount";
import { fetchBlogListAll } from "@/src/libs/microcms/blog";

async function AsideMenu() {
  const contents = await fetchBlogListAll('blog');
  const categories: ResultPostData = getTotalCount(contents, 'category');
  const tags: ResultPostData = getTotalCount(contents, 'tag');

  return (
    <aside className={styles.aside}>
      <section className={styles.container}>
        <h2 className={styles.listIetmTitle}>
          <FontAwesomeIcon icon={faListUl} size="1x" className={styles.listItemTitleIcon} />
          <span className={styles.listIetmTitleText}>カテゴリー</span>
        </h2>
        <ul className={styles.list}>
          {
            Object.keys(categories).map(cat => (
              <li key={categories[cat].name}>
                <Category data={categories[cat]} totalCount={categories[cat].count} />
              </li>
            ))
          }
        </ul>
      </section>
      <section className={styles.container}>
        <h2 className={styles.listIetmTitle}>
          <FontAwesomeIcon icon={faTags} className={styles.listItemTitleIcon} />
          <span className={styles.listIetmTitleText}>タグ</span>
        </h2>
        <ul className={styles.list}>
          {
            Object.keys(tags).map(tag => (
              <li key={tags[tag].name}>
                <Tag data={tags[tag]} totalCount={tags[tag].count} />
              </li>
            ))
          }
        </ul>
      </section>
      <YearArchive />
    </aside>
  )
}

export default AsideMenu;
