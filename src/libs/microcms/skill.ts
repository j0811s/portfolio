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

if (!process.env.MICROCMS_HISTORY_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_HISTORY_SERVICE_DOMAIN is required");
}

if (!process.env.MICROCMS_HISTORY_API_KEY) {
  throw new Error("MICROCMS_HISTORY_API_KEY is required");
}

// API取得用のクライアントを作成
const historyClient = createClient({
  serviceDomain: process.env.MICROCMS_HISTORY_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_HISTORY_API_KEY,
  retry: true,
})

// 経歴エンドポイントを取得
const fetchSkillList = async (
  endpoint: string = "skill",
  queries?: MicroCMSQueries,
  customRequestInit?: CustomRequestInit
) => {
  let response;

  try {
    response = await historyClient.getList<SkillSet>({
      endpoint,
      queries,
      customRequestInit,
    });
  } catch (error) {
    notFound();
  }

  return response;
}

// 経歴エンドポイントの詳細を取得
const fetchSkillDetail = async (
  endpoint: string = "skill",
  contentId: string,
  queries?: MicroCMSQueries
) => {
  let response;

  try {
    response = await historyClient.getListDetail<SkillSet>({
      endpoint,
      contentId,
      queries
    });
  } catch (error) {
    notFound();
  };

  return response;
}

// 経歴をすべて取得
export const fetchSkillAll = async (
  endpoint: string = "skill",
  queries?: MicroCMSQueries
) => {
  let response;

  try {
    response = await historyClient.getAllContents<SkillSet>({
      endpoint,
      queries
    })
  } catch (error) {
    notFound();
  }

  return response;
}