import { permanentRedirect } from 'next/navigation';

type Props = {
  params: Promise<{ num: string }>;
};

export default async function Page({ params }: Props) {
  const { num } = await params;
  if (num === '1') {
    permanentRedirect('/blog/');
  }
  permanentRedirect(`/blog/?page=${num}`);
}
