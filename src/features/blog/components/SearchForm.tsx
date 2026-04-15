'use client';

import styles from '@/src/features/blog/styles/SearchForm.module.css';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useRef, useState } from 'react';

type Props = {
  defaultValue?: string;
};

export default function SearchForm({ defaultValue = '' }: Props) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasValue, setHasValue] = useState(defaultValue !== '');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = inputRef.current?.value.trim();

    if (!q) {
      return;
    }

    router.push(`/blog/search?q=${encodeURIComponent(q)}`);
  };

  const handleReset = () => {
    if (inputRef.current) {
      inputRef.current.value = '';
    }
    setHasValue(false);
    router.push('/blog/');
  };

  return (
    // biome-ignore lint/a11y/useSemanticElements: <search>要素はReactのJSX型定義が未対応
    <form className={styles.form} onSubmit={handleSubmit} role="search">
      <input
        ref={inputRef}
        className={styles.input}
        type="search"
        name="q"
        defaultValue={defaultValue}
        placeholder="キーワードで検索"
        aria-label="ブログ記事を検索"
        onChange={(e) => setHasValue(e.target.value !== '')}
      />
      {hasValue && (
        <button className={styles.button} type="button" aria-label="リセット" onClick={handleReset}>
          <FontAwesomeIcon icon={faXmark} size="sm" />
        </button>
      )}
      <button className={styles.button} type="submit" aria-label="検索">
        <FontAwesomeIcon icon={faSearch} size="sm" />
      </button>
    </form>
  );
}
