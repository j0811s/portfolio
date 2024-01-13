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

export type SkillInfo = {
  fieldId: string
  name: string
  logo: {
    url: string
    height: number
    width: number
  }
}[]

export type SkillContent = {
  id: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
  category: string
  skills: SkillInfo
}

export type CareerInfo = {
  fieldId: string
  project: string
  details: string
}[]

export type CareerContent = {
  id: string
  createdAt: string
  updatedAt: string
  publishedAt: string
  revisedAt: string
  period: string
  info: CareerInfo
}

if (!process.env.MICROCMS_HISTORY_SERVICE_DOMAIN) {
  throw new Error("MICROCMS_HISTORY_SERVICE_DOMAIN is required");
}

if (!process.env.MICROCMS_HISTORY_API_KEY) {
  throw new Error("MICROCMS_HISTORY_API_KEY is required");
}

// API取得用のクライアントを作成
export const historyClient = createClient({
  serviceDomain: process.env.MICROCMS_HISTORY_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_HISTORY_API_KEY,
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
})

// 経歴エンドポイントを取得
export const getHistoryList = async (
  endpoint: string = "skill",
  queries?: MicroCMSQueries,
  customRequestInit?: CustomRequestInit
) => {
  
  const listData = await historyClient.getList({
    endpoint,
    queries,
    customRequestInit,
  })
  .catch(notFound);

  return listData;
}

// 経歴エンドポイントの詳細を取得
export const getHistoryDetail = async (
  endpoint: string = "skill",
  contentId: string,
  queries?: MicroCMSQueries
) => {
  const detailData = await historyClient.getListDetail({
    endpoint,
    contentId,
    queries
  })
  .catch(notFound);

  return detailData;
}

// 経歴エンドポイントをすべて取得
export const getHistoryAllContents = async (
  endpoint: string = "skill",
  queries?: MicroCMSQueries
) => {
  const detailDataAll = await historyClient.getAllContents({
    endpoint,
    queries
  })
  .catch(notFound);

  return detailDataAll;
}