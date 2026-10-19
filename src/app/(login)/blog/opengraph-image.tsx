import { ImageResponse } from 'next/og';
import { OgImageContent } from '@/src/components';

export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image(_: { params: Promise<Record<string, string>> }) {
  return new ImageResponse(<OgImageContent text={'投稿'} />, { ...size });
}
