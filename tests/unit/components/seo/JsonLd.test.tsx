import { render } from '@testing-library/react';
import { renderToStaticMarkup } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import JsonLd from '@/src/components/seo/JsonLd';

const renderScript = (data: object) => {
  const { container } = render(<JsonLd data={data} />);
  return container.querySelector('script[type="application/ld+json"]') as HTMLScriptElement;
};

describe('JsonLd', () => {
  it('データを JSON として出力する', () => {
    const data = { '@type': 'BlogPosting', headline: '記事タイトル' };

    expect(JSON.parse(renderScript(data).innerHTML)).toEqual(data);
  });

  // microCMS の記事データに </script> が含まれても script 要素を抜けられないこと
  it('</script> を含む値をエスケープし、元の値として読み戻せる', () => {
    const data = { headline: '</script><script>alert(1)</script>' };
    const script = renderScript(data);

    expect(script.innerHTML).not.toContain('</script');
    expect(script.innerHTML).not.toContain('<');
    expect(JSON.parse(script.innerHTML)).toEqual(data);
  });

  // 実際に問題になるサーバー側の HTML 出力でも、script 要素が1つのまま閉じられること
  it.each([
    ['</script>', '</script><script>alert(1)</script>'],
    ['<!--', '<!--<script>'],
  ])('サーバー出力で %s を含む値が script 要素を抜けない', (_, headline) => {
    const html = renderToStaticMarkup(<JsonLd data={{ headline }} />);

    expect(html.match(/<\/script>/g)).toHaveLength(1);
    expect(html.match(/<script/g)).toHaveLength(1);
    expect(html).not.toContain('<!--');
  });
});
