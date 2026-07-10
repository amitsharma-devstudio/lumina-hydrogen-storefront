type JsonLdProps = {
  data: Record<string, unknown> | Array<Record<string, unknown>>;
};

/**
 * Renders a JSON-LD script tag for search engines.
 * Keep payloads serializable (no functions / circular refs).
 */
export function JsonLd({data}: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{__html: JSON.stringify(data)}}
    />
  );
}

type BreadcrumbItem = {
  name: string;
  url?: string | null;
};

export function buildBreadcrumbListJsonLd(
  items: BreadcrumbItem[],
  origin?: string | null,
) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      ...(item.url
        ? {
            item: item.url.startsWith('http')
              ? item.url
              : `${(origin ?? '').replace(/\/$/, '')}${item.url}`,
          }
        : {}),
    })),
  };
}

export function buildOrganizationJsonLd(origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'Lumina',
    url: origin,
    description:
      'Clinical-grade skincare with clean ingredients. Shop serums, moisturizers, and curated collections.',
  };
}

export function buildWebSiteJsonLd(origin: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'Lumina',
    url: origin,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${origin}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  };
}

type ProductJsonLdInput = {
  name: string;
  description?: string | null;
  url: string;
  image?: string | null;
  sku?: string | null;
  brand?: string | null;
  price?: string | null;
  currencyCode?: string | null;
  availability?: boolean | null;
};

export function buildProductJsonLd({
  name,
  description,
  url,
  image,
  sku,
  brand,
  price,
  currencyCode,
  availability,
}: ProductJsonLdInput) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name,
    ...(description ? {description} : {}),
    ...(image ? {image: [image]} : {}),
    ...(sku ? {sku} : {}),
    ...(brand ? {brand: {'@type': 'Brand', name: brand}} : {}),
    offers: {
      '@type': 'Offer',
      url,
      ...(price ? {price} : {}),
      ...(currencyCode ? {priceCurrency: currencyCode} : {}),
      availability:
        availability === false
          ? 'https://schema.org/OutOfStock'
          : 'https://schema.org/InStock',
    },
  };
}
