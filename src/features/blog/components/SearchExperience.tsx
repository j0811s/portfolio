'use client';

import styles from '@/src/features/blog/styles/SearchExperience.module.css';
import searchFormStyles from '@/src/features/blog/styles/SearchForm.module.css';
import ArticleCardList from '@/src/features/blog/components/ArticleCardList';
import Pagination from '@/src/features/blog/components/Pagination';
import { SectionTitle } from '@/src/components';
import { LIMIT } from '@/src/constants/blog';
import { faSearch, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useEffect, useRef, useState } from 'react';

type Props = {
  initialKeyword: string;
  initialPage: number;
  initialContents: BlogPost[];
  initialTotalCount: number;
};

export default function SearchExperience({
  initialKeyword,
  initialPage,
  initialContents,
  initialTotalCount,
}: Props) {
  const [keyword, setKeyword] = useState(initialKeyword);
  const [page, setPage] = useState(initialPage);
  const [contents, setContents] = useState(initialContents);
  const [totalCount, setTotalCount] = useState(initialTotalCount);
  const [isFetching, setIsFetching] = useState(false);
  const [hasError, setHasError] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const abortControllerRef = useRef<AbortController | undefined>(undefined);
  const previousKeywordRef = useRef(initialKeyword);

  const runSearch = (value: string, targetPage: number) => {
    const trimmed = value.trim();
    const offset = (targetPage - 1) * LIMIT;

    abortControllerRef.current?.abort();
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setIsFetching(true);
    setHasError(false);

    const apiParams = new URLSearchParams();
    if (trimmed) {
      apiParams.set('q', trimmed);
    }
    apiParams.set('limit', String(LIMIT));
    if (offset > 0) {
      apiParams.set('offset', String(offset));
    }

    fetch(`/api/blog?${apiParams.toString()}`, { signal: controller.signal })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`/api/blog responded ${res.status}`);
        }
        return res.json();
      })
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

    const urlParams = new URLSearchParams();
    if (trimmed) {
      urlParams.set('q', trimmed);
    }
    if (targetPage > 1) {
      urlParams.set('page', String(targetPage));
    }
    const queryString = urlParams.toString();
    window.history.replaceState(null, '', queryString ? `/blog/?${queryString}` : '/blog/');
  };

  useEffect(() => {
    // previousKeywordRef (not a boolean flag) makes this guard idempotent under React
    // StrictMode's dev-mode double-invoked effects — see the StrictMode bugfix in this
    // branch's history for what breaks if this becomes a one-shot isFirstRender check.
    if (keyword === previousKeywordRef.current) {
      return;
    }
    previousKeywordRef.current = keyword;
    setPage(1);

    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    timerRef.current = setTimeout(() => {
      runSearch(keyword, 1);
    }, 300);

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, [keyword]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setPage(1);
    runSearch(keyword, 1);
  };

  const handleReset = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    previousKeywordRef.current = '';
    setKeyword('');
    setPage(1);
    runSearch('', 1);
  };

  const handlePageChange = (newPage: number) => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    setPage(newPage);
    window.scrollTo({ top: 0 });
    runSearch(keyword, newPage);
  };

  const trimmedKeyword = keyword.trim();

  return (
    <section>
      <SectionTitle
        title={trimmedKeyword ? `「${trimmedKeyword}」の検索結果：${totalCount}件` : '投稿'}
      />
      <div aria-live="polite" className="sr-only">
        {page > 1 ? `${page}ページ目・${totalCount}件の記事` : `${totalCount}件の記事`}
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
      {hasError && (
        <p className={styles.error} role="status">
          検索に失敗しました。
        </p>
      )}
      <ArticleCardList
        contents={contents}
        emptyMessage={
          contents.length < 1
            ? trimmedKeyword
              ? `「${trimmedKeyword}」に一致する記事が見つかりませんでした。`
              : '記事が見つかりませんでした。'
            : undefined
        }
      />
      <Pagination
        pager={{ totalCount, limit: LIMIT, currentPage: page }}
        onPageChange={handlePageChange}
      />
    </section>
  );
}
