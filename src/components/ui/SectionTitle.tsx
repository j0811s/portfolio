import styles from '@/src/components/styles/ui/SectionTitle.module.css';
import clsx from 'clsx';

type Props = {
  children?: React.ReactNode;
  className?: string;
  title: string;
  label?: string;
  variant?: 'default' | 'editorial';
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export default function SectionTitle({
  children,
  className,
  title,
  label,
  variant = 'default',
  level = 1,
}: Props) {
  const TitleTag = `h${level}` as const;

  if (variant === 'editorial') {
    return (
      <div className={clsx(styles.editorialWrapper, className)}>
        {label && (
          <span className={styles.editorialNumber} aria-hidden="true">
            {label}
          </span>
        )}
        <TitleTag className={styles.editorialTitle}>
          {children}
          <span>{title}</span>
        </TitleTag>
      </div>
    );
  }

  return (
    <TitleTag className={clsx(styles.title, className ?? '')}>
      {children}
      <span>{title}</span>
    </TitleTag>
  );
}
