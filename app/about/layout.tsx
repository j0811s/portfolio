import { container, wrapper } from '../styles/about/layout.css'

type AboutLayout = {
  children: React.ReactNode
}

export default function AboutLayout({ children }: AboutLayout) {
  
  return (
    <div className={container}>
      <div className={wrapper}>
        {children}
      </div>
    </div>
  )
}