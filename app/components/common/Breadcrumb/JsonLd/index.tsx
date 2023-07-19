import { WithContext, BreadcrumbList } from 'schema-dts'; // https://github.com/google/schema-dts

type Props = {
  type?: {
    slug?: string;
    id?: string;
    name?: string;
  },
  post?: {
    id?: string;
    title?: string;
  }
}

export const JsonLd = ({type = {}, post = {}}: Props) => {
  const { id, title } = post;
  const { slug, id: typeId, name: typeName } = type;
  
  const getJsonLd = (id?: string, title?: string, slug?: string): WithContext<BreadcrumbList> => {
    const SITE_URL = 'https://portfolio-doe4gyax2-mormo.vercel.app';

    switch (slug) {
      case 'blog': {
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "トップページ",
              "item": `${SITE_URL}`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "ブログ",
              "item": `${SITE_URL}/blog`
            }
          ]
        }
      }
      case 'post': {
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "トップページ",
              "item": `${SITE_URL}`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "ブログ",
              "item": `${SITE_URL}/blog`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": title,
              "item": `${SITE_URL}/blog/${id}`
            }
          ]
        }
      }
      case 'categories':
      case 'tags':
      case 'archive': {
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "トップページ",
              "item": `${SITE_URL}`
            },
            {
              "@type": "ListItem",
              "position": 2,
              "name": "ブログ",
              "item": `${SITE_URL}/blog`
            },
            {
              "@type": "ListItem",
              "position": 3,
              "name": typeName,
              "item": `${SITE_URL}/blog/${slug}/${typeId}`
            }
          ]
        }
      }
      default: {
        return {
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          "itemListElement": [
            {
              "@type": "ListItem",
              "position": 1,
              "name": "トップページ",
              "item": `${SITE_URL}`
            }
          ]
        }
      }
    }
  }

  const BreadcrumbListLeaf = getJsonLd(id, title, slug);

  return (
    <script
      key="json-ld"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(BreadcrumbListLeaf) }}
    />
  )
}