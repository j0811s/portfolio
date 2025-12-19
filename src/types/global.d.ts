import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSDate,
  CustomRequestInit,
  MicroCMSContentId
} from "microcms-js-sdk";

declare global {
  // Page Props
  export type PageProps = {
    params: Promise<Record<string, string>>;
  }

  // パンクバンドのJSON LD
  export type BreadcrumbJsonLd = {
    taxonomies?: {
      slug?: string;
      id?: string;
      name?: string;
    }
    post?: {
      id?: string;
      title?: string;
    }
  }

  //投稿の型定義
  export type Blog = {
    endpoint: string,
    id: string;
    title: string;
    content: string;
    eyecatch?: MicroCMSImage;
    category: {
      id: string,
      createdAt: string,
      updatedAt: string,
      publishedAt: string,
      revisedAt: string,
      name: string,
      slug: string
    }[],
    tag: {
      id: string,
      createdAt: string,
      updatedAt: string,
      publishedAt: string,
      revisedAt: string,
      name: string
    }[],
    contents: any[],
    name: string,
    length: number
  } & MicroCMSDate & MicroCMSImage;

  // カテゴリの型定義
  export type Category = {
    name: string;
  } & MicroCMSContentId & MicroCMSDate;

  // タグの型定義
  export type Tag = {
    name: string;
  } & MicroCMSContentId & MicroCMSDate;

  // 投稿記事の型定義
  export type BlogPost = {
    id: string;
    title: string;
    content: string;
    eyecatch?: MicroCMSImage;
    category: {
      id: string,
      createdAt: string,
      updatedAt: string,
      publishedAt: string,
      revisedAt: string,
      name: string,
      slug: string
    }[],
    tag: {
      id: string,
      createdAt: string,
      updatedAt: string,
      publishedAt: string,
      revisedAt: string,
      name: string
    }[],
  } & MicroCMSDate & MicroCMSImage;

  export type SkillInfo = {
    fieldId: string
    name: string
    logo: {
      url: string
      height: number
      width: number
    }
    hidden: boolean
  }[]

  export type SkillSet = {
    id: string
    createdAt: string
    updatedAt: string
    publishedAt: string
    revisedAt: string
    category: string
    skills: SkillInfo
  }
}

export { }