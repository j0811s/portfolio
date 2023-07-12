import Link from "next/link";

export default function NotFound() {
  return (
    <section className="notFound">
      <h1>404 NotFound</h1>
      <p>ページが見つかりませんでした。</p>
      <Link href="/">トップページへ戻る</Link>
    </section>
  );
}