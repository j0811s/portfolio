type Props = {
  children: React.ReactNode;
  params: Promise<{
    postId: string;
  }>
}

export default async function Layout({ children, params }: Props) {
  return (
    <>
      {children}
    </>
  )
}