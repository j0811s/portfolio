import { Metadata } from 'next';
import { AsideMenu } from '@/src/features/blog';

export const metadata: Metadata = {
  title: 'ブログ',
}

type BlogLayout = {
  children: React.ReactNode
}

export default function BlogLayout({ children }: BlogLayout) {
  
  return (
    <div>
      {children}
      <AsideMenu />
    </div>
  )
}