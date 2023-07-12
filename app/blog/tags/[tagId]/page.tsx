import Link from "next/link";
import { getList, getTag } from "../../../libs/microcms";

type Props = {
  params: {
    tagId: string;
  };
};

export default async function Page({ params }: Props) {
  const { tagId } = params;
  const tag = await getTag(tagId);
  console.log(tag);

  // const data = await getList({
  //   filters: `tags[contains]${tagId}`,
  // });
  // const tag = await getTagList(tagId);

  return (
    <section>
      <h1>Tag: { tag.name }</h1>
    </section>
  );
}