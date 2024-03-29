import { list } from "../index.css";
import { ListItem } from "../ListItem";

type GenerateTagsProps = {
  [key: string]: any
}

export const GenerateTags = ({ tagData }: GenerateTagsProps) => {
  const tags = Object.keys(tagData).sort((a, b) => (a < b ? -1 : 1));
  if (tags.length === 0) return <></>;

  return (
    <ul className={list}>
      <ListItem tags={tags} tagData={tagData} />
    </ul>
  )
}