import { container, title } from "./index.css";
import { Breadcrumb } from "@/src/app/components/common/Breadcrumb";

type Props = {
  subHeadline?: boolean;
  pageTitle: string;
  type?: {
    slug?: string;
    id?: string;
    name?: string;
  },
  post?: {
    id?: string;
    title?: string;
  },
  currentPage?: number
  isBreadcrumb?: boolean
}

export const PageTitle = ({ subHeadline = false, pageTitle, type, post, currentPage = 1, isBreadcrumb = true }: Props) => {
  const pageClassName = currentPage > 1 ? 'mod-page' : ''

  return (
    <div className={`${container} ${pageClassName}`}>
      { isBreadcrumb && <Breadcrumb type={{ ...type }} post={{...post}} /> }
      { subHeadline ? <h2 className={`${title} ${pageClassName}`}>{pageTitle}{type?.name ? `: ${ type.name }` : ''}</h2> : <h1 className={`${title} ${pageClassName}`}>{pageTitle}{type?.name ? `: ${ type.name }` : ''}</h1>}
    </div>
  )
}