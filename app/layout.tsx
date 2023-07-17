import './styles/globals.css';
import { html, body, container, footer } from './styles/layout.css';
import { Header } from './components/common/header';
import { Footer } from './components/common/footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
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