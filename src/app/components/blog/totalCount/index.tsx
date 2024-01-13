import { Blog } from "../../../libs/microcms/blog"

type GetTotalCountData = {
  [key: string]: {
    name?: string,
    count: number,
    slug?: string,
  }
}

export const GetTotalCount = (contents: Blog[], type: string): GetTotalCountData => {
  const data: GetTotalCountData = {}

  contents.forEach((post: {
    [type: string]: any
  }) => {
    post[type].forEach((type: {
      name: string, id: string, slug: string
    }) => {
      if (data[type.id]) {
        data[type.id].count++;
      } else {
        data[type.id] = {
          name: type.name,
          count: 1,
          slug: type.slug
        }
      }
    });
  })

  return data;
}