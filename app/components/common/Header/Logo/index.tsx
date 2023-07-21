import { logo } from "./index.css";
import Link from "next/link";

type Logo = ({ pathname }: { pathname: string }) => JSX.Element;

export const Logo: Logo = ({ pathname }) => {
  return (
    pathname === '/' ?
      <h1 className={logo}><span>J.Sato Portfolio</span></h1> :
      <div className={logo}><Link href={`/`}>J.Sato Portfolio</Link></div>
  )
}