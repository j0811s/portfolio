type JsonLdProps<T extends object> = {
  data: T;
};

function JsonLd<T extends object>({ data }: JsonLdProps<T>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        // 値は microCMS の記事データ由来のため、`</script>` で script 要素を抜けられないよう `<` をエスケープする
        __html: JSON.stringify(data).replace(/</g, '\\u003c'),
      }}
    />
  );
}

export default JsonLd;
