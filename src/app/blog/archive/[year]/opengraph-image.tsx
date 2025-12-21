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
  const { year } = await params;

  return new ImageResponse(<OgImageContent text={`年別アーカイブ：${year}年`} />, { ...size });
}
