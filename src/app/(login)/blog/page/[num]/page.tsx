import { permanentRedirect } from 'next/navigation';
import { parsePageNumber } from '@/src/libs/blog/pagination';

type Props = {
  params: Promise<{ num: string }>;
};

/**
 * 旧 URL の `/blog/page/N/` を、統合した一覧の `/blog/?page=N` へ転送する。
 * 1 ページ目と不正なページ番号（`abc`・`01` など）は `/blog/` へ転送する（#81）。
 */
export default async function Page({ params }: Props) {
  const { num } = await params;
  const page = parsePageNumber(num);
  if (page === undefined || page === 1) {
    permanentRedirect('/blog/');
  }
  permanentRedirect(`/blog/?page=${page}`);
}
