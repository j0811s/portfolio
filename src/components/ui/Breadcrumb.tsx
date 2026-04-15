import styles from '@/src/components/styles/ui/Breadcrumb.module.css';
import clsx from 'clsx';
import Link from 'next/link';
import { JsonLd } from '@/src/components';
import { createBreadcrumbJsonLd } from '@/src/libs/seo/jsonLd';

interface DataProps {
  name: string;
  url: string;
}

function Breadcrumb({ data, className }: { data: DataProps[]; className?: string }) {
  if (!Array.isArray(data)) {
    return null;
  }

  const dataCount = data.length;

  return (
    <>
      <JsonLd data={createBreadcrumbJsonLd(data)} />
      <nav className={clsx(styles.container, className)}>
        <ol className={clsx(styles.list)}>
          {data.map((item, i) => {
            return dataCount === ++i ? (
              <li
                className={clsx(
                  styles.listItem,
                  styles.currentPage,
                  'u-ellipsis u-ellipsis--short'
                )}
                key={item.url}
              >
                {item.name}
              </li>
            ) : (
              <li className={styles.listItem} key={item.url}>
                <Link className={styles.link} href={item.url}>
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ol>
      </nav>
    </>
  );
}

export default Breadcrumb;
