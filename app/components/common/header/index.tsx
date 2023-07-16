import {
  container, wrapper,
  menuButton
} from "./index.css"
import Link from "next/link";
import Image from 'next/image';

export const Header = () => {

  return (
    <header className={container}>
      <div className={wrapper}>
        <h1>ヘッダー</h1>
        <nav>
          <ul>
            <li>
              <Link href={`/`}>トップページ</Link>
              <Link href={`/blog/`}>ブログ</Link>
            </li>
          </ul>
        </nav>
        <button className={menuButton} type="button">
          <span>メニュー</span>
        </button>
      </div>
    </header>
  )
}