import type { MetadataRoute } from 'next';
import { SITE_META } from '@/src/constants/site';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: SITE_META.title,
    short_name: SITE_META.title,
    description: SITE_META.description,
    start_url: '/',
    display: 'standalone',
    background_color: '#e8eaf0',
    theme_color: '#ff7e0f',
    lang: 'ja',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
      { src: '/logo.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
      { src: '/icon-maskable-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
    shortcuts: [
      { name: 'ブログ一覧', url: '/blog/' },
      { name: 'ブログ検索', url: '/blog/search/' },
      { name: 'スキル一覧', url: '/#skills' },
      { name: 'お問い合わせ', url: '/contact/' },
    ],
  };
}
