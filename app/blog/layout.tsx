import { container, wrapper } from '../styles/blog/layout.css'
import { BlogAside } from "../components/blog/BlogAside";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'ブログ',
}

type BlogLayout = {
  children: React.ReactNode
}

export default function BlogLayout({ children }: BlogLayout) {
  
  return (
    <div className={container}>
      <div className={wrapper}>
        {children}
        <BlogAside />
      </div>
    </div>
  )
}