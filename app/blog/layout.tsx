import { blogLayoutContainer } from '../styles/blog/layout.css'
import { BlogAside } from "../components/blog/BlogAside";

import { loaderContainer, loader } from '../styles/loading.css'
export default function BlogLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <>
      <div className={blogLayoutContainer}>
        {children}
        <BlogAside modClassName='blogLayoutContainer' />
      </div>
    </>
  )
}