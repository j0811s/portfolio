import { container, pageTitle, pageSubTitle, ctaButtonContainer } from "./styles/not-found/index.css";

export default function NotFound() {
  return (
    <section className={container}>
      <hgroup>
        <h1 className={pageTitle}>404 | Page Not Found</h1>
        <p className={pageSubTitle}>ご指定のページが見つかりませんでした。</p>
      </hgroup>
    </section>
  );
}