import styles from '@/src/features/header/styles/Logo.module.css';
import Link from 'next/link';

type Props = {
  as?: 'h1' | 'div';
  link?: boolean;
};

export default function Logo({ as = 'div', link = true }: Props) {
  const Tag = as;

  return (
    <Tag className={styles.title}>
      {link ? (
        <Link className={styles.link} href={`/`}>
          Portfolio Site
        </Link>
      ) : (
        <span className={styles.link}>Portfolio Site</span>
      )}
    </Tag>
  );
}
