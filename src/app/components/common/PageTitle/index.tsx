import { container, title } from "./index.css";
import { Breadcrumb } from "@/src/app/components/common/Breadcrumb";

type Props = {
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

export const PageTitle = ({ pageTitle, type, post, currentPage = 1, isBreadcrumb = true }: Props) => {
  const pageClassName = currentPage > 1 ? 'mod-page' : ''

  return (
    <div className={`${container} ${pageClassName}`}>
      { isBreadcrumb && <Breadcrumb type={{ ...type }} post={{...post}} /> }
      <h1 className={`${title} ${pageClassName}`}>{pageTitle}{type?.name ? `: ${ type.name }` : ''}</h1>
    </div>
  )
}