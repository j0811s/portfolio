import { ImageResponse } from 'next/og';
import { OgImageContent } from '@/src/components';
import { fetchBlogDetail } from '@/src/libs/microcms/blog';
 
export const runtime = 'edge';
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png';

export default async function Image({ params }: { params: Promise<Record<string, string>> }) {
  const { postId } = await params;
  const post = await fetchBlogDetail('blog', postId);

  return new ImageResponse(<OgImageContent text={post.title || '投稿'} />, { ...size });
}
