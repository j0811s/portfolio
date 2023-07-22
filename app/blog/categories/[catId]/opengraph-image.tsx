import { ImageResponse } from 'next/server'
import { getDetail } from '../../../libs/microcms'
 
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
  params: { catId: string };
};
export default async function Image({ params: { catId } }: Props) {
  const typeName = 'categories';
  const category = await getDetail(typeName, catId);
 
  // Font
  const notoSansBold = await fetch(
    new URL('../../../../public/fonts/NotoSansJP-Bold.woff', import.meta.url)
  ).then((res) => res.arrayBuffer())
    
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
      >{category.name}</div>
    ),
    // ImageResponse options
    {
      // For convenience, we can re-use the exported opengraph-image
      // size config to also set the ImageResponse's width and height.
      ...size,
      fonts: [
        {
          name: 'NotoSansJP',
          data: notoSansBold,
          style: 'normal',
          weight: 700,
        },
      ],
    }
  )
}