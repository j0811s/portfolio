// https://blog.microcms.io/nextjs13-microcms-rsc/
import { notFound } from 'next/navigation';
import { createClient } from "microcms-js-sdk";
import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSDate,
  CustomRequestInit,
  MicroCMSContentId
} from "microcms-js-sdk";

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
    name: string,
    slug: string
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


if (!process.env.MICROCMS_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_SERVICE_DOMAIN is required");
}

if (!process.env.MICROCMS_API_KEY) {
  throw new Error("MICROCMS_API_KEY is required");
}

// API取得用のクライアントを作成
export const client = createClient({
  serviceDomain: process.env.MICROCMS_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_API_KEY,
  retry: true,
  customFetch: (input, init) => {
    if (typeof input === 'string') {
      const newInput = new URL(input)
      const time = new Date()
      newInput.searchParams.set('cacheclearparam', `${time.getMinutes()}`)
      return fetch(newInput.href, init)
    }
    return fetch(input, init)
  },
});

// ブログ一覧を取得
export const getList = async (
  endpoint: string = "blog",
  queries?: MicroCMSQueries,
  customRequestInit?: CustomRequestInit
) => {
  
  const listData = await client.getList<Blog>({
    endpoint,
    queries,
    customRequestInit,
  })
  .catch(notFound);

  return listData;
};

// ブログの詳細を取得
export const getDetail = async (
  endpoint: string = "blog",
  contentId: string,
  queries?: MicroCMSQueries
) => {
  const detailData = await client.getListDetail<Blog>({
    endpoint,
    contentId,
    queries
  })
  .catch(notFound);

  return detailData;
};

// カテゴリの一覧を取得
export const getCatgoryList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Category>({
      endpoint: 'categories',
      queries,
    })
    .catch(notFound);

  return listData;
};

// カテゴリの詳細を取得
export const getCategory = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client
    .getListDetail<Category>({
      endpoint: 'categories',
      contentId,
      queries,
    })
    .catch(notFound);

  return detailData;
};

// タグの一覧を取得
export const getTagList = async (queries?: MicroCMSQueries) => {
  const listData = await client
    .getList<Tag>({
      endpoint: 'tag',
      queries,
    })
    .catch(notFound);

  return listData;
};

// タグの詳細を取得
export const getTag = async (contentId: string, queries?: MicroCMSQueries) => {
  const detailData = await client
    .getListDetail<Tag>({
      endpoint: 'tag',
      contentId,
      queries,
    })
    .catch(notFound);

  return detailData;
};