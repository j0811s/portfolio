import { logo, logoInner, logoImg, siteName } from "./index.css";
import Link from "next/link";
import Image from "next/image";

type Logo = ({ pathname }: { pathname: string }) => JSX.Element;

export const Logo: Logo = ({ pathname }) => {
  return (
    pathname === '/' ?
      <h1 className={logo}>
        <span className={logoInner}>
          <Image className={logoImg} src={`/logo.png`} width={30} height={30} alt="J.Sato ポートフォリオサイト" priority />
        </span>
      </h1> :
      <div className={logo}>
        <Link className={logoInner} href={`/`}>
          <Image className={logoImg} src={`/logo.png`} width={30} height={30} alt="J.Sato ポートフォリオサイト" priority />
        </Link>
      </div>
  )
}