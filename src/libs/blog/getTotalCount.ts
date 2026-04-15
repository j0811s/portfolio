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

  contents.forEach((post: { [type: string]: { name: string; id: string; slug?: string }[] }) => {
    post[type].forEach((type: { name: string; id: string; slug?: string }) => {
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
