# 検索UI改善（実行中フィードバック・0件表示） 設計書

日付: 2026-08-10（2026-08-16 改訂: 後述「改訂履歴」参照）
ステータス: 承認済み（改訂反映済み）

## 背景と目的

ユーザーから「検索中のUIがわかりづらい」というフィードバックがあった。調査の結果、以下3点が原因と特定した。

1. `SearchForm`（`src/features/blog/components/SearchForm.tsx`）は送信時に`router.push`するだけで、ローディング状態（disabled化・スピナー表示等）を一切持たない。ボタンを押しても「検索中である」ことが視覚的にわからない。
2. 検索結果が0件のとき、`ArticleCardList`が`null`を返すだけで専用の空状態表示がない。`SectionTitle`の「◯件」という数字でしか0件を判別できない。
3. 検索結果ページへの遷移中は、検索専用のローディングUIではなくアプリ共通の`src/app/loading.tsx`（全画面タイルスピナー）に置き換わるため、「検索している」という文脈が失われ遷移が唐突に感じる。

本設計は(1)〜(3)すべてを、検索結果ページ専用の`loading.tsx`を追加することで一括して対応する（詳細は「改訂履歴」参照）。(2)は別途`ArticleCardList.tsx`への`emptyMessage`追加で対応する。

## 変更内容

### 1. `src/app/(login)/blog/search/loading.tsx` — 検索専用ローディングUIの追加

`/blog/search`は`searchParams`に依存する動的ルートであり、専用の`loading.tsx`が存在しない。そのためNext.jsはこのルートへの遷移中、直近の祖先セグメントが持つ`loading.tsx`（今回のケースではルート直下の`src/app/loading.tsx`）のSuspenseフォールバックを表示する。ルート直下の`loading.tsx`は`(login)/layout.tsx`（`GlobalHeader`・`GlobalFooter`を含む）ごとSuspendするため、ヘッダー・フッターごと全画面スピナーに置き換わり、「検索している」文脈が失われる（原因3）。

`src/app/(login)/blog/search/`配下に`loading.tsx`を追加すると、Suspense境界がこのセグメント直下（`search/page.tsx`の出力のみ）に狭まり、`GlobalHeader`・`GlobalFooter`は遷移中も表示され続けたまま、検索結果の表示領域だけがローディングUIに置き換わるようになる。これにより、ボタン押下から結果表示までの間、常に何らかの視覚的フィードバックが即座に得られる（原因1）と同時に、遷移の唐突さも緩和される（原因3）。

既存のルート直下`loading.tsx`（`src/app/loading.tsx`）と同じ構成（`LoadingSpinner`をそのまま表示するのみ）を踏襲し、新規コンポーネントは追加しない。

```tsx
import { LoadingSpinner } from '@/src/components';

export default function Loading() {
  return <LoadingSpinner />;
}
```

`SearchForm.tsx`自体への変更は行わない（理由は「改訂履歴」参照）。

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

- **ユニットテスト（新規）**: `tests/unit/features/blog/components/ArticleCardList.test.tsx`（未存在の場合は新規作成）で、`emptyMessage`ありで0件のときにメッセージが表示され、`emptyMessage`なしで0件のときは何も描画されないことを確認する。
- `loading.tsx`自体はNext.jsのファイル規約に基づくSuspenseフォールバックであり、`src/app/loading.tsx`（既存のルート直下版）にも自動テストが存在しない。今回追加する`search/loading.tsx`も同様に自動テストの対象外とし、動作確認は手動確認に委ねる。
- **手動確認**: ログイン後にブラウザで検索を実行し、`GlobalHeader`・`GlobalFooter`を表示したまま検索結果の表示領域だけがローディングUIに切り替わることを確認する。存在しないキーワードで検索し、0件メッセージが表示されることを確認する。

## スコープ外

- 検索結果カードのスケルトン表示（`loading.tsx`内でカード形状のプレースホルダーを描画する等）: 今回は既存の`LoadingSpinner`を流用するに留める。それでも不十分と判断された場合は、別途設計して追加を検討する。
- デバウンス・インクリメンタルサーチ（入力中のクライアントサイド絞り込み、`useDeferredValue`等）: 現行のフォーム送信ベースの設計を維持する。
- 検索結果のキーワードハイライト表示、サジェスト機能。
- `ArticleCardList`の他の呼び出し元（一覧・アーカイブ・タグ・カテゴリページ）への`emptyMessage`適用。

## 改訂履歴

**2026-08-16: `SearchForm.tsx`への`useTransition`導入案を撤回し、`loading.tsx`方式に変更**

実装計画の作成中に検証した結果、当初案（`push`を`useTransition`の`startTransition`でラップし`isPending`でdisabled/スピナー表示を制御する）は、このリポジトリのNext.js v16.3.0 / React 19.2.3では機能しないことが判明した。

- React 19.2.3の実装（`react-dom/cjs/react-dom-client.development.js`の`startTransition`関数）は、`startTransition`に渡したコールバックの**戻り値がPromiseである場合のみ**、そのPromiseの解決を待って`isPending`を`false`に戻す。戻り値がPromiseでない場合は、コールバック実行直後に同期的に`isPending`を`false`へ戻す。
- `next/navigation`の`useRouter().push()`は戻り値を返さない（`void`）。そのため`startTransition(() => { push(url) })`という書き方では、`isPending`は実際のナビゲーション完了（Server Componentのレンダリング完了）を待たず、1フレーム未満で`false`に戻ってしまう。スピナー・disabled状態は実質的に機能しない。
- Next.js公式ドキュメント（`node_modules/next/dist/docs/`）を確認したところ、`router.push`のようなプログラム的な遷移に対して`isPending`相当のフィードバックを得る公式パターンは存在しない。`useLinkStatus`フックはプログラム的な遷移用のpending取得手段として文書化されているように見えるが、実際には`<Link>`コンポーネントの子孫でのみ動作し（`useOptimistic`ベースの別実装）、`useRouter().push()`を使うフォーム送信には適用できない。ドキュメントが動的ルートの遷移フィードバックとして明示的に推奨しているのは`loading.tsx`の追加である。

この検証結果をユーザーに提示し、代替案（A: 検索専用`loading.tsx`の追加、B: `SearchForm`内で手動`useState`管理）を提示した上で、**A（`loading.tsx`追加）を採用**する判断を得た。これに伴い、当初スコープ外としていた「検索専用の`loading.tsx`」を今回のスコープに含め、`SearchForm.tsx`自体への変更（disabled化・アイコン切り替え）は行わないこととした。
