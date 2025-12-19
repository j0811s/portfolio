import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '投稿',
}

type BlogLayout = {
  children: React.ReactNode
}

export default function BlogLayout({ children }: BlogLayout) {
  return <>{ children }</>;
}