import { Suspense } from 'react';
import Loading from '@/src/app/loading';

type Props = {
  children: React.ReactNode
}

export default function Layout({ children }: Props) {
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  )
}