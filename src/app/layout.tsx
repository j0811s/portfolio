import '@fortawesome/fontawesome-svg-core/styles.css';
import 'highlight.js/styles/hybrid.css';
import '../styles/index.css';
import { SITE_META } from '@/src/constants/site';
import type { Metadata, Viewport } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleTagManager } from '@next/third-parties/google';
import { config } from '@fortawesome/fontawesome-svg-core';
import { JetBrains_Mono, M_PLUS_Rounded_1c } from 'next/font/google';

config.autoAddCss = false;

// next/font でビルド時に自己ホストし、CSS 変数として index.css の --font-sans / --font-mono から参照する
const mPlusRounded = M_PLUS_Rounded_1c({
  weight: ['400', '500', '700'],
  // 日本語のグリフは unicode-range で分割配信されるため、プリロード対象のサブセットは指定しない
  preload: false,
  display: 'swap',
  variable: '--font-m-plus-rounded',
});
const jetBrainsMono = JetBrains_Mono({
  weight: ['400', '500'],
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-jetbrains-mono',
});

const themeInitScript = `(function(){try{var c=document.cookie.split('; ').find(function(r){return r.startsWith('theme=')});var t=c?c.split('=')[1]:null;if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;
const swRegisterScript = `if('serviceWorker' in navigator){window.addEventListener('load',function(){navigator.serviceWorker.register('/sw.js').catch(function(){});});}`;

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  metadataBase: SITE_META.siteUrl,
  title: {
    default: `${SITE_META.title}`,
    template: `%s | ${SITE_META.title}`,
  },
  description: SITE_META.description,
  alternates: {
    canonical: SITE_META.siteUrl,
  },
  openGraph: {
    type: 'website',
    url: SITE_META.siteUrl,
    title: SITE_META.title,
    description: SITE_META.description,
    siteName: SITE_META.sitename,
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ff7e0f' },
    { media: '(prefers-color-scheme: dark)', color: '#3a7fa8' },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId: string = process.env.GA_ID || '';
  const gtmId: string = process.env.GTM_ID || '';

  return (
    <html
      lang="ja"
      className={`${mPlusRounded.variable} ${jetBrainsMono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: FOUC防止のインラインスクリプト */}
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
        {/* biome-ignore lint/security/noDangerouslySetInnerHtml: Service Worker登録の軽量インラインスクリプト */}
        <script dangerouslySetInnerHTML={{ __html: swRegisterScript }} />
      </head>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      {gaId && <GoogleAnalytics gaId={gaId} />}
      <body>{children}</body>
    </html>
  );
}
