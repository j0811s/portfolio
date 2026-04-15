import styles from '@/src/components/styles/ui/SectionTitle.module.css';
import clsx from 'clsx';

type Props = {
  children?: React.ReactNode;
  className?: string;
  title: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
};

export default function SectionTitle({ children, className, title, level = 1 }: Props) {
  const TitleTag = `h${level}` as const;

  return (
    <TitleTag className={clsx(styles.title, className ?? '')}>
      {children}
      <span>{title}</span>
    </TitleTag>
  );
}
