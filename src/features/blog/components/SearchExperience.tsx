'use client';

import styles from '@/src/features/blog/styles/SearchExperience.module.css';
import searchFormStyles from '@/src/features/blog/styles/SearchForm.module.css';
import { ArticleCardList } from '@/src/features/blog/';
import { SectionTitle } from '@/src/components';
import { LIMIT } from '@/src/constants/blog';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

type Props = {
  initialKeyword: string;
  initialContents: BlogPost[];
  initialTotalCount: number;
};

export default function SearchExperience({
  initialKeyword,
  initialContents,
  initialTotalCount,
}: Props) {
  const { push } = useRouter();
  const [keyword, setKeyword] = useState(initialKeyword);
  const [contents, setContents] = useState(initialContents);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | undefined>(undefined);
  const isFirstRender = useRef(true);

  const runSearch = (value: string) => {
    const trimmed = value.trim();

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsFetching(true);
    setHasError(false);

    const query = trimmed ? `?q=${encodeURIComponent(trimmed)}&limit=${LIMIT}` : `?limit=${LIMIT}`;

    fetch(`/api/blog${query}`, { signal: controller.signal })
      .then((res) => res.json())
      .then((data: { contents: BlogPost[]; totalCount: number }) => {
        setContents(data.contents);
        setTotalCount(data.totalCount);
        setIsFetching(false);
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === 'AbortError') {
          return;
        }
        setIsFetching(false);
        setHasError(true);
      });

    window.history.replaceState(
      null,
      '',
      trimmed ? `/blog/search?q=${encodeURIComponent(trimmed)}` : '/blog/search'
    );
  };

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      runSearch(keyword);
    }, 300);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [keyword]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    runSearch(keyword);
  };

  const handleReset = () => {
    push('/blog/');
  };

  const trimmedKeyword = keyword.trim();

  return (
    <section>
      <SectionTitle
        title={trimmedKeyword ? `「${trimmedKeyword}」の検索結果：${totalCount}件` : '検索'}
      />
      <div aria-live="polite" className={styles.visuallyHidden}>
        {trimmedKeyword ? `${totalCount}件の検索結果` : ''}
      </div>
      {/* biome-ignore lint/a11y/useSemanticElements: <search>要素はReactのJSX型定義が未対応 */}
      <form className={searchFormStyles.form} onSubmit={handleSubmit} role="search">
        <input
          className={searchFormStyles.input}
          type="search"
          name="q"
          value={keyword}
          placeholder="キーワードで検索"
          aria-label="ブログ記事を検索"
          onChange={(e) => setKeyword(e.target.value)}
        />
        <span className={styles.indicator} data-fetching={isFetching} aria-hidden="true" />
        {keyword !== '' && (
          <button
            className={searchFormStyles.button}
            type="button"
            aria-label="リセット"
            onClick={handleReset}
          >
            <FontAwesomeIcon icon={faXmark} size="sm" />
          </button>
        )}
        <button className={searchFormStyles.button} type="submit" aria-label="検索">
          <FontAwesomeIcon icon={faSearch} size="sm" />
        </button>
      </form>
      {hasError && <p className={styles.error}>検索に失敗しました。</p>}
      <ArticleCardList
        contents={contents}
        emptyMessage={
          trimmedKeyword ? `「${trimmedKeyword}」に一致する記事が見つかりませんでした。` : undefined
        }
      />
    </section>
  );
}
