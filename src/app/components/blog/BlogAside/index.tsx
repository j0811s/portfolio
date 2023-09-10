import { asideContainer } from './index.css';
import { Categories } from "../Categories";
import { Tags } from "../Tags";
import { YearArchive } from "../YearArchive";

type BlogAside = {
  modClassName?: string
}

export const BlogAside = ({ modClassName = "" }: BlogAside) => {
  return (
    <aside className={`${asideContainer} ${modClassName}`}>
      <Categories />
      <Tags />
      <YearArchive />
    </aside>
  )
}