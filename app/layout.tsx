import './styles/globals.css';
import { html, body, container, footer } from './styles/layout.css';
import { Header } from './components/common/header';
import { Footer } from './components/common/footer';
import { Metadata } from 'next';

const SITE_URL: string = process.env.SITE_URL || '';

const myMeta = {
  title: 'J.Sato Portfolio',
  sitename: 'J.Sato Portfolio',
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
    siteName: myMeta.sitename,
    images: [{
      url: '/ogp.png',
      width: 1200,
      height: 630,
    }]
  }
}

type RootLayout = {
  children: React.ReactNode
}

export default function RootLayout({ children }: RootLayout ) {
  return (
    <html lang="ja" className={html}>
      <body className={body}>
        <Header />
        <main className={container}>{children}</main>
        <Footer modClassName={footer} />
      </body>
    </html>
  )
}