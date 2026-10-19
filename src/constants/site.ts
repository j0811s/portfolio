export const SITE_URL: string = process.env.SITE_URL || 'http://127.0.0.1:3000';

export const SITE_META = {
  title: 'ポートフォリオサイト',
  sitename: 'ポートフォリオサイト',
  description: 'ポートフォリオサイト',
  // react-doctor-disable-next-line react-doctor/no-unguarded-throwing-parse-call -- 不正な SITE_URL はビルド時に失敗させて気付けるようにする
  siteUrl: new URL(SITE_URL),
};
