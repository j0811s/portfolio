import './styles/globals.css';
import { config } from '@fortawesome/fontawesome-svg-core'
import '@fortawesome/fontawesome-svg-core/styles.css'
config.autoAddCss = false

import { ThemeProvider } from "@/src/app/components/ThemeProvider";
import { lightTheme, darkTheme } from "@/src/app/styles/common/variables.css";
import { html, body, container } from './styles/layout.css';
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
    <html lang="ja" className={html} suppressHydrationWarning>
      <body className={body}>
        <ThemeProvider
          defaultTheme="light"
          attribute="class"
          enableSystem={true}
          disableTransitionOnChange={true}
          storageKey="jsato-theme"
          value={{
            light: lightTheme,
            dark: darkTheme,
          }}
        >
          <Header />
          <main className={container}>
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}