// https://blog.microcms.io/microcms-next15-jamstack-blog/
import { notFound, unstable_rethrow } from 'next/navigation';
import { createClient } from 'microcms-js-sdk';
import type { MicroCMSQueries } from 'microcms-js-sdk';

if (!process.env.MICROCMS_HISTORY_SERVICE_DOMAIN) {
  throw new Error('MICROCMS_HISTORY_SERVICE_DOMAIN is required');
}

if (!process.env.MICROCMS_HISTORY_API_KEY) {
  throw new Error('MICROCMS_HISTORY_API_KEY is required');
}

// API取得用のクライアントを作成
const historyClient = createClient({
  serviceDomain: process.env.MICROCMS_HISTORY_SERVICE_DOMAIN,
  apiKey: process.env.MICROCMS_HISTORY_API_KEY,
  retry: true,
});

// 経歴をすべて取得
export const fetchSkillAll = async (endpoint: string = 'skill', queries?: MicroCMSQueries) => {
  let response: SkillSet[] | undefined;

  try {
    response = await historyClient.getAllContents<SkillSet>({
      endpoint,
      queries,
    });
  } catch (error) {
    unstable_rethrow(error);
    notFound();
  }

  return response;
};
