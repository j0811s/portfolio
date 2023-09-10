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
  }
}

export const PageTitle = ({ pageTitle, type, post }: Props) => {

  return (
    <div className={container}>
      <Breadcrumb type={{ ...type }} post={{...post}} />
      <h1 className={title}>{pageTitle}{type?.name ? `: ${ type.name }` : ''}</h1>
    </div>
  )
}