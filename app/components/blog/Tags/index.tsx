import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTags } from "@fortawesome/free-solid-svg-icons";
import { container, listIetmTitle, listIetmTitleText } from "./index.css";
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
      <h2 className={listIetmTitle}>
        <FontAwesomeIcon icon={faTags} />
        <span className={listIetmTitleText}>タグ</span>
      </h2>
      <GenerateTags tagData={tagData} />
    </div>
  )
}