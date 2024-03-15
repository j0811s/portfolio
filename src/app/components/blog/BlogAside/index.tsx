import { asideContainer } from './index.css';
import { TableOfContents } from '../TableOfContents';
import { Categories } from "../Categories";
import { Tags } from "../Tags";
import { YearArchive } from "../YearArchive";

type BlogAside = {
  modClassName?: string
}

export const BlogAside = ({ modClassName = "" }: BlogAside) => {
  return (
    <aside className={`${asideContainer} ${modClassName}`}>
      <TableOfContents />
      <Categories />
      <Tags />
      <YearArchive />
    </aside>
  )
}