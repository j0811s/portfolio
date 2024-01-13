import { logo, logoInner, logoImg, siteName } from "./index.css";
import Link from "next/link";

type Logo = ({ pathname }: { pathname: string }) => JSX.Element;

export const Logo: Logo = ({ pathname }) => {
  return (
    pathname === '/' ?
      <h1 className={logo}>
        <div className={logoInner}>
          <img className={logoImg} src="/logo.png" alt="" />
          {/* <span className={siteName}>J.Sato</span> */}
        </div>
      </h1> :
      <div className={logo}>
        <Link className={logoInner} href={`/`}>
          <img className={logoImg} src="/logo.png" alt="" />
          {/* <span className={siteName}>J.Sato</span> */}
        </Link>
      </div>
  )
}