import styles from "@/src/features/blog/styles/AsideMenu.module.css";
import { Category, Tag, YearArchive } from "@/src/features/blog";
import { faListUl, faTags } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function AsideMenu() {
  const categories: Category[] = [
    {
      id: "1",
      name: "テスト",
      createdAt: "string;",
      updatedAt: "string;",
    },
    {
      id: "2",
      name: "テスト2",
      createdAt: "string;",
      updatedAt: "string;",
    }
  ];
  
  const tags: Tag[] = [
    {
      id: "1",
      name: "テスト",
      createdAt: "string;",
      updatedAt: "string;",
    },
    {
      id: "2",
      name: "テスト2",
      createdAt: "string;",
      updatedAt: "string;",
    }
  ];

  return (
    <aside className={styles.aside}>
      <section className={styles.container}>
        <h2 className={styles.listIetmTitle}>
          <FontAwesomeIcon icon={faListUl} size="1x" className={styles.listItemTitleIcon} />
          <span className={styles.listIetmTitleText}>カテゴリー</span>
        </h2>
        <ul className={styles.list}>
          {
            categories.map(cat => (
              <li key={cat.name}>
                <Category data={cat} totalCount={2} />
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
            tags.map(tag => (
              <li key={tag.name}>
                <Tag data={tag} totalCount={1} />
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
