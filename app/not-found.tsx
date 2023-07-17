import { container, pageTitle, pageSubTitle, ctaButton } from "./styles/not-found/index.css";
import { CtaButton } from "./components/common/ctaButton";

export default function NotFound() {
  return (
    <section className={container}>
      <hgroup>
        <h2 className={pageTitle}>404 / Page Not Found</h2>
        <p className={pageSubTitle}>ご指定のページが見つかりませんでした。<br />下記のリンクよりページを移動してください。</p>
      </hgroup>
      <CtaButton href="/" modClass={ctaButton}>トップページへ</CtaButton>
      <CtaButton href="/blog/" modClass={ctaButton}>ブログページへ</CtaButton>
    </section>
  );
}