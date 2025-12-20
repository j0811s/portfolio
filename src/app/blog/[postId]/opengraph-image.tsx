import { ImageResponse } from 'next/og'
import Image from 'next/image'
import { fetchBlogDetail } from '@/src/libs/microcms/blog';

// Route segment config
export const runtime = 'edge'

// Image metadata
export const alt = 'アイキャッチ画像'
export const size = {
  width: 1200,
  height: 630,
}

export const contentType = 'image/png'

// Image generation
type Props = {
  params: { postId: string };
};
export default async function OgImage({ params: { postId } }: Props) {

  // const notoSansBold = await fetch(
  //   new URL('../../../public/fonts/NotoSansJP-Bold.woff', import.meta.url)
  // ).then((res) => res.arrayBuffer())

  const post = await fetchBlogDetail('blog', postId);

  if (post.eyecatch?.url) {
    return (new ImageResponse(<Image src={post.eyecatch?.url} alt={alt} width="1200" height="630" />))
  }

  return new ImageResponse(
    (
      // ImageResponse JSX element
      <div
        style={{
          fontSize: 40,
          background: '#fff',
          color: '#000',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* {post.title} */}{post.id} | 投稿
      </div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      // fonts: [
      //   {
      //     name: 'NotoSansJP',
      //     data: notoSansBold,
      //     style: 'normal',
      //     weight: 700,
      //   },
      // ],
    }
  )
}