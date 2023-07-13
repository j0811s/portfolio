import { Categories } from "../Categories";
import { Tags } from "../Tags";
import { YearArchive } from "../YearArchive";

type BlogAside = {
  modClassName?: string
}

export const BlogAside = ({ modClassName = "" }: BlogAside) => {
  return (
    <aside className={`aside ${modClassName}`}>
      <Categories />
      <Tags />
      <YearArchive />
    </aside>
  )
}