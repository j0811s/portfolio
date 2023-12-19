import { container, pageTitle, pageSubTitle, ctaButtonContainer } from "./styles/not-found/index.css";
import { CtaButton } from "./components/common/ctaButton";

export default function NotFound() {
  return (
    <section className={container}>
      <hgroup>
        <h1 className={pageTitle}>404 | Page Not Found</h1>
        <p className={pageSubTitle}>ご指定のページが見つかりませんでした。<br />下記のリンクよりページを移動してください。</p>
      </hgroup>
      <div className={ctaButtonContainer}>
        <CtaButton href="/">TOPに移動する</CtaButton>
        <CtaButton href="/about/">ABOUTに移動する</CtaButton>
        <CtaButton href="/blog/">BLOGに移動する</CtaButton>
      </div>
    </section>
  );
}