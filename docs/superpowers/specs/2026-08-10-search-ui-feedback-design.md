# 検索UI改善（実行中フィードバック・0件表示） 設計書

日付: 2026-08-10
ステータス: 承認済み

## 背景と目的

ユーザーから「検索中のUIがわかりづらい」というフィードバックがあった。調査の結果、以下3点が原因と特定した。

1. `SearchForm`（`src/features/blog/components/SearchForm.tsx`）は送信時に`router.push`するだけで、ローディング状態（disabled化・スピナー表示等）を一切持たない。ボタンを押しても「検索中である」ことが視覚的にわからない。
2. 検索結果が0件のとき、`ArticleCardList`が`null`を返すだけで専用の空状態表示がない。`SectionTitle`の「◯件」という数字でしか0件を判別できない。
3. 検索結果ページへの遷移中は、検索専用のローディングUIではなくアプリ共通の`src/app/loading.tsx`（全画面タイルスピナー）に置き換わるため、「検索している」という文脈が失われ遷移が唐突に感じる。

本設計は(1)と(2)を実装することで対応する。(3)は検索専用の`loading.tsx`を新設せず、(1)によるフォーム側の即時フィードバックで緩和する方針とする（スコープ外の節を参照）。

## 変更内容

### 1. `SearchForm.tsx` — `useTransition`によるpending状態の表示

`push`を`startTransition`でラップし、`isPending`中は入力欄・送信ボタン・リセットボタンを`disabled`にする。送信ボタンのアイコンは検索アイコン（`faSearch`）からスピナー（`faSpinner`、`spin`プロパティで回転）に切り替える。

```tsx
'use client';

import styles from '@/src/features/blog/styles/SearchForm.module.css';
import { faSearch, faSpinner, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useRouter } from 'next/navigation';
import { useRef, useState, useTransition } from 'react';

export default function SearchForm({ defaultValue = '' }: Props) {
  const { push } = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [hasValue, setHasValue] = useState(defaultValue !== '');
  const [isPending, startTransition] = useTransition();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const q = inputRef.current?.value.trim();
    if (!q) return;

    startTransition(() => {
      push(`/blog/search?q=${encodeURIComponent(q)}`);
    });
  };

  // handleReset も同様に startTransition でラップする

  return (
    <form className={styles.form} onSubmit={handleSubmit} role="search" aria-busy={isPending}>
      <input ref={inputRef} disabled={isPending} /* ...既存props */ />
      {hasValue && (
        <button type="button" disabled={isPending} aria-label="リセット">
          <FontAwesomeIcon icon={faXmark} size="sm" />
        </button>
      )}
      <button type="submit" disabled={isPending} aria-label="検索" aria-busy={isPending}>
        <FontAwesomeIcon icon={isPending ? faSpinner : faSearch} spin={isPending} size="sm" />
      </button>
    </form>
  );
}
```

`useTransition`はApp Routerのナビゲーション＋データ取得（Server Componentのレンダリング）が完了するまで`isPending`を`true`に保つため、追加のstate管理なしで「検索結果ページの表示が終わるまで」のフィードバックが得られる。

`disabled`時のスタイル（`opacity`低下・`cursor: not-allowed`）を`SearchForm.module.css`の`.button:disabled`・`.input:disabled`に追加する。

### 2. `ArticleCardList.tsx` — `emptyMessage` propの追加

他の呼び出し元（トップページ・ブログ一覧・アーカイブ・タグ・カテゴリ、計6箇所）は現状の「0件なら何も描画しない」を維持する。`emptyMessage`を渡した場合のみメッセージを表示する、後方互換なオプトイン方式にする。

```tsx
interface Props {
  contents: BlogPost[];
  className?: string;
  emptyMessage?: string;
}

export default function ArticleCardList({ contents, className = '', emptyMessage }: Props) {
  if (contents.length < 1) {
    return emptyMessage ? <p className={styles.empty}>{emptyMessage}</p> : null;
  }
  // ...既存のリスト表示
}
```

`search/page.tsx`側でキーワードがある場合のみ`emptyMessage`を渡す（キーワード未指定時の`/blog/search`アクセスは通常の一覧的な表示のため対象外）。

```tsx
<ArticleCardList
  contents={contents}
  emptyMessage={keyword ? `「${keyword}」に一致する記事が見つかりませんでした。` : undefined}
/>
```

`.empty`のスタイルを`ArticleCardList.module.css`に追加（中央寄せ・`var(--text-secondary)`・余白）。

## テスト・確認方法

- **ユニットテスト（更新・追加）**: `tests/unit/features/blog/components/SearchForm.test.tsx`
  - 送信直後（`isPending`中）に送信ボタンが`disabled`になることを確認するテストを追加。
  - 既存の`vi.mock('next/navigation', ...)`の`push`モックは同期関数のため、`startTransition`内で呼んでも既存アサーション（`mockPush`が呼ばれる）はそのまま通る想定。`act()`関連の警告が出る場合は`@testing-library/react`の`fireEvent`が内部で`act`をラップしているため通常は不要。
  - 新規: `tests/unit/features/blog/components/ArticleCardList.test.tsx`（未存在の場合は新規作成）で、`emptyMessage`ありで0件のときにメッセージが表示され、`emptyMessage`なしで0件のときは何も描画されないことを確認する。
- **手動確認**: ブラウザで検索を実行し、送信ボタンが検索アイコンからスピナーに切り替わり結果表示まで操作不能になることを確認する。存在しないキーワードで検索し、0件メッセージが表示されることを確認する。

## スコープ外

- 検索専用の`loading.tsx`（結果カードのスケルトン表示）: 今回は`SearchForm`側のpending表示で遷移の唐突さを緩和する方針とする。それでも不十分と判断された場合は、別途設計して追加を検討する。
- デバウンス・インクリメンタルサーチ（入力中のクライアントサイド絞り込み、`useDeferredValue`等）: 現行のフォーム送信ベースの設計を維持する。
- 検索結果のキーワードハイライト表示、サジェスト機能。
- `ArticleCardList`の他の呼び出し元（一覧・アーカイブ・タグ・カテゴリページ）への`emptyMessage`適用。
