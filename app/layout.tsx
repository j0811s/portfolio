import './styles/globals.css';
import { container } from './styles/layout.css';
import { Header } from './components/common/header';
import { Footer } from './components/common/footer';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ja">
      <body>
        <Header />
        <main className={container}>{children}</main>
        <Footer />
      </body>
    </html>
  )
}