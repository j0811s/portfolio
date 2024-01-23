import { logo, logoInner, logoImg, siteName } from "./index.css";
import Link from "next/link";

type Logo = ({ pathname }: { pathname: string }) => JSX.Element;

export const Logo: Logo = ({ pathname }) => {
  return (
    pathname === '/' ?
      <h1 className={logo}>
        <span className={logoInner}>
          <img className={logoImg} src="/logo.png" alt="J.Sato ポートフォリオサイト" />
        </span>
      </h1> :
      <div className={logo}>
        <Link className={logoInner} href={`/`}>
          <img className={logoImg} src="/logo.png" alt="J.Sato ポートフォリオサイト" />
        </Link>
      </div>
  )
}