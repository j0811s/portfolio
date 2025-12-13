import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSDate,
  CustomRequestInit,
  MicroCMSContentId
} from "microcms-js-sdk";

declare global {

  //ブログの型定義
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