type Props = {
  children: React.ReactNode;
  params: Promise<{
    postId: string;
  }>;
};

export default async function Layout({ children }: Props) {
  return <>{children}</>;
}
