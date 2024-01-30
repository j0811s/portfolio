import './styles/globals.css';

import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import { html, body, container, footer } from './styles/layout.css';
import { Suspense } from 'react';
import { Header } from '@/src/app/components/common/Header';
import { Footer } from '@/src/app/components/common/Footer';
import { Metadata } from 'next';

const SITE_URL: string = process.env.SITE_URL || '';

const myMeta = {
  title: 'J.Sato - Portfolio Site',
  sitename: 'J.Sato - Portfolio Site',
  description: "個人のポートフォリオサイトです。",
  siteUrl: new URL(SITE_URL)
}

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  metadataBase: myMeta.siteUrl,
  title: {
    default: `${myMeta.title}`, 
    template: `%s | ${myMeta.title}`
  },
  description: myMeta.description,
  viewport: "width=device-width, initial-scale=1",
  alternates: {
    canonical: myMeta.siteUrl
  },
  openGraph: {
    type: "website",
    url: myMeta.siteUrl,
    title: myMeta.title,
    description: myMeta.description,
    siteName: myMeta.sitename
  }
}

type RootLayout = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayout ) {
  return (
    <html lang="ja" className={html}>
      <body className={body}>
        <Suspense>
          <Header />
        </Suspense>
        <main className={container}>{children}</main>
        <Footer modClassName={footer} />
      </body>
    </html>
  )
}