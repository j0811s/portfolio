import { container } from "./index.css";
import { getList } from "../../../libs/microcms";
import { GetTotalCount } from "../totalCount";
import { GenerateTags } from "./GenerateTags";

export const Tags = async () => {
  const { contents } = await getList('blog', {
    limit: 1000
  });
  
  if (contents.length === 0) return;

  const tagData = GetTotalCount(contents, 'tag');
  
  return (
    <div className={container}>
      <h2>タグ</h2>
      <GenerateTags tagData={tagData} />
    </div>
  )
}