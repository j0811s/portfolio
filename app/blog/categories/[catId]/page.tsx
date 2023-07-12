import Link from "next/link";
import { getList, getCategory } from "../../../libs/microcms";

type Props = {
  params: {
    catId: string;
  };
};

export default async function Page({ params }: Props) {
  const { catId } = params;
  const category = await getCategory(catId);
  console.log(category);

  // const data = await getList({
  //   filters: `tags[contains]${tagId}`,
  // });
  // const tag = await getTagList(tagId);

  return (
    <section>
      <h1>Category: { category.name }</h1>
    </section>
  );
}