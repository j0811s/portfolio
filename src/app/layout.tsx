import { SITE_META } from '@/src/constants/site';
import { Metadata, Viewport } from 'next';
import { GoogleAnalytics } from '@next/third-parties/google';
import { GoogleTagManager } from '@next/third-parties/google'

import "../styles/index.css";
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import { Icons } from '@/src/components';
import { GlobalHeader } from '@/src/features/header';
import { GlobalFooter } from '@/src/features/footer';

export const metadata: Metadata = {
  robots: { index: false, follow: false },
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
      {gtmId && <GoogleTagManager gtmId={gtmId} />}
      <body>
        <Icons />
        <GlobalHeader />
        <main>
          {children}
        </main>
        <GlobalFooter />
      </body>
      {gaId && <GoogleAnalytics gaId={gaId} />}
    </html>
  )
}