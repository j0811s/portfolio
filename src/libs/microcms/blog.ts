// https://blog.microcms.io/microcms-next15-jamstack-blog/
import { notFound } from 'next/navigation';
import { createClient } from "microcms-js-sdk";
import type {
  MicroCMSQueries,
  MicroCMSImage,
  MicroCMSDate,
  CustomRequestInit,
  MicroCMSContentId
} from "microcms-js-sdk";

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
  retry: true
})

// ブログ一覧を取得
export const fetchBlogList = async (
  endpoint: string = "blog",
  queries?: MicroCMSQueries,
  customRequestInit?: CustomRequestInit
) => {
  let response;

  try {
    response = await client.getList<Blog>({
      endpoint,
      queries,
      customRequestInit,
    });
  } catch (error) {
    notFound();
  }

  return response;
}

// ブログの詳細を取得
export const fetchBlogDetail = async (
  endpoint: string = "blog",
  contentId: string,
  queries?: MicroCMSQueries
) => {
  let response;

  try {
    response = await client.getListDetail<Blog>({
      endpoint,
      contentId,
      queries
    });
  } catch (error) {
    notFound();
  }

  return response;
}

// コンテンツをすべて取得
export const fetchBlogAll = async (
  endpoint: string = "blog",
  queries?: MicroCMSQueries
) => {
  let response;

  try {
    response = await client.getAllContents({
      endpoint,
      queries
    });
  } catch (error) {
    notFound();
  }

  return response;
}

// エンドポイントのコンテンツIDをすべて取得
export const fetchAllBlogId = async (endpoint: string = "blog") => {
  const ids = await client.getAllContentIds({ endpoint })
    .then((res) => console.log(res))
    .catch((err) => console.error(err));

  return ids;
}