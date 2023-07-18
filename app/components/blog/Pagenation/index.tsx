import Link from "next/link"

type PagenationParam = {
  pager: number[];
  type?: {
    slug?: string;
    id?: string;
    name?: string;
  }
}

export const Pagenation = ({ pager, type }: PagenationParam) => {
  if (pager.length <= 1) return

  const urlPath = !type?.slug
    ? '/blog/page/'
    : `/blog/${type?.slug}/${type?.id}/page/`

  return (
    <div>
      <h3>{type?.name}</h3>
      <ul>
        {
          pager.map(num => (
            <li key={num}>
              {
                num === 0
                  ? <span>{num + 1}</span>
                  : <Link href={`${urlPath}${num + 1}`}>{num + 1}</Link> 
              }
            </li>
          ))
        }
      </ul>
    </div>
  )
}