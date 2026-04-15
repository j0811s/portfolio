type JsonLdProps<T extends object> = {
  data: T;
};

function JsonLd<T extends object>({ data }: JsonLdProps<T>) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data),
      }}
    />
  );
}

export default JsonLd;
