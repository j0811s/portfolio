
export const SITE_URL: string = process.env.SITE_URL || 'http://127.0.0.1:3000';

export const SITE_META = {
  title: 'ポートフォリオサイト',
  sitename: 'ポートフォリオサイト',
  description: "ポートフォリオサイト",
  siteUrl: new URL(SITE_URL)
}
