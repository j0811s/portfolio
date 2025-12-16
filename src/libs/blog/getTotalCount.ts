type TotalCountData = {
  [key: string]: {
    name?: string,
    count: number,
    slug?: string,
  }
}

export const getTotalCount = (contents: Blog[], type: string): TotalCountData => {
  const data: TotalCountData = {}

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