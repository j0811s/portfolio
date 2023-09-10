import { ImageResponse } from 'next/server'
 
// Route segment config
export const runtime = 'edge'
 
// Image metadata
export const alt = '私について アイキャッチ画像'
export const size = {
  width: 1200,
  height: 630,
}
 
export const contentType = 'image/png'
 
// Image generation
export default async function Image() {
 
  // const notoSansBold = await fetch(
  //   new URL('../../public/fonts/NotoSansJP-Bold.woff', import.meta.url)
  // ).then((res) => res.arrayBuffer())
    
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
      >ABOUT</div>
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