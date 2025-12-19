import { Suspense } from 'react';
import Loading from '@/src/app/loading';

type Props = {
  children: React.ReactNode;
  params: Promise<{
    postId: string;
  }>
}

export default async function Layout({ children, params }: Props) {
  return (
    <>
      <Suspense fallback={<Loading />}>
        {children}
      </Suspense>
    </>
  )
}