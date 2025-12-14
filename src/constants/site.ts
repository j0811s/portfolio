
export const SITE_URL: string = process.env.SITE_URL || '';

export const SITE_META = {
  title: 'Portfolio Site',
  sitename: 'Portfolio Site',
  description: "ポートフォリオサイト",
  siteUrl: new URL(SITE_URL)
}