import { permanentRedirect } from 'next/navigation';

type Props = {
  searchParams: Promise<{ q?: string }>;
};

export default async function Page({ searchParams }: Props) {
  const { q } = await searchParams;
  const keyword = q?.trim();
  if (keyword) {
    permanentRedirect(`/blog/?q=${encodeURIComponent(keyword)}`);
  }
  permanentRedirect('/blog/');
}
