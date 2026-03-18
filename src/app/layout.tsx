import '@fortawesome/fontawesome-svg-core/styles.css';
import 'highlight.js/styles/hybrid.css';
import "../styles/index.css";
import { SITE_META } from '@/src/constants/site';
import { Metadata, Viewport } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleTagManager } from '@next/third-parties/google'
import { config } from '@fortawesome/fontawesome-svg-core';

config.autoAddCss = false;

const themeInitScript = `(function(){try{var c=document.cookie.split('; ').find(function(r){return r.startsWith('theme=')});var t=c?c.split('=')[1]:null;if(t!=='light'&&t!=='dark'){t=window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';}document.documentElement.setAttribute('data-theme',t);}catch(e){}})();`;

export const metadata: Metadata = {
  // robots: { index: false, follow: false },
  metadataBase: SITE_META.siteUrl,
  title: {
    default: `${SITE_META.title}`,
    template: `%s | ${SITE_META.title}`
  },
  description: SITE_META.description,
  alternates: {
    canonical: SITE_META.siteUrl
  },
  openGraph: {
    type: "website",
    url: SITE_META.siteUrl,
    title: SITE_META.title,
    description: SITE_META.description,
    siteName: SITE_META.sitename
  }
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const gaId: string = process.env.GA_ID || '';
  const gtmId: string = process.env.GTM_ID || '';

  return (
    <html lang="ja" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      {gaId && <GoogleAnalytics gaId={gaId} />}
      <body>
        {children}
      </body>
    </html>
  )
}
