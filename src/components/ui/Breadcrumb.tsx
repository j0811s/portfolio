import Link from "next/link";

function Breadcrumb() {
  return (
    <ol>
      <li>
        <Link href={'/'}>TOP</Link>
      </li>
    </ol>
  )
}

export default Breadcrumb;
