export type PostData = {
  name?: string;
  count: number;
  slug?: string;
  id?: string;
};

export type ResultPostData = {
  [key: string]: PostData;
};

export const getTotalCount = (contents: Blog[], type: string): ResultPostData => {
  const data: ResultPostData = {};

  contents.forEach((post) => {
    const items = (
      post as unknown as Record<string, { name: string; id: string; slug?: string }[]>
    )[type];
    items.forEach((type: { name: string; id: string; slug?: string }) => {
      if (data[type.id]) {
        data[type.id].count++;
      } else {
        data[type.id] = {
          name: type.name,
          count: 1,
          slug: type.slug,
          id: type.id,
        };
      }
    });
  });

  return data;
};
