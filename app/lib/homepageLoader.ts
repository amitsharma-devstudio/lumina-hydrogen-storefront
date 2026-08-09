import type {Storefront} from '@shopify/hydrogen';
import type {FeaturedCollectionFragment} from 'storefrontapi.generated';
import {FeaturedCollectionsQuery} from '~/graphql/queries/FeaturedCollectionsQuery';
import {HomeHeroQuery} from '~/graphql/queries/HomeHeroQuery';
import {HomePromoBannersQuery} from '~/graphql/queries/HomePromoBannersQuery';
import {BestsellersProductsQuery} from '~/graphql/queries/BestsellersProductsQuery';
import {
  buildHomeHeroData,
  buildHomePromoBannerData,
  isHeroEmpty,
  type HomePromoSlide,
  type MetaobjectField,
} from '~/lib/homepage';
import {getCollectionProductNodes} from '~/components/home/productsSection.types';
import type {CollectionProductList} from '~/components/home/productsSection.types';
import {
  BESTSELLERS_HANDLE_CANDIDATES,
  filterMerchandisingCollections,
  HOMEPAGE_CURATED_HANDLE_CANDIDATES,
  NEW_ARRIVALS_HANDLE_CANDIDATES,
  resolveCollectionHandle,
} from '~/lib/storeCollections';

export const HOME_HERO_METAOBJECT_TYPE = 'home_hero';
export const HOME_PROMO_BANNER_METAOBJECT_TYPE = 'home_promo_banner';

const HOMEPAGE_COLLECTION_EXCLUDE = new Set([
  ...BESTSELLERS_HANDLE_CANDIDATES,
  ...NEW_ARRIVALS_HANDLE_CANDIDATES,
]);

export function selectCuratedCollections(
  nodes: FeaturedCollectionFragment[],
): FeaturedCollectionFragment[] {
  const byHandle = new Map(nodes.map((c) => [c.handle, c]));

  const curatedFromHandles = HOMEPAGE_CURATED_HANDLE_CANDIDATES.flatMap(
    (candidates) => {
      const match = resolveCollectionHandle(byHandle, candidates);
      return match ? [match] : [];
    },
  );

  if (curatedFromHandles.length > 0) return curatedFromHandles.slice(0, 4);

  return filterMerchandisingCollections(nodes)
    .filter((c) => !HOMEPAGE_COLLECTION_EXCLUDE.has(c.handle))
    .slice(0, 4);
}

function mapPromoMetaobjectsToSlides(
  nodes: Array<{id: string; fields?: MetaobjectField[] | null}>,
): HomePromoSlide[] {
  const slides: HomePromoSlide[] = [];

  nodes.forEach((node) => {
    const parsed = buildHomePromoBannerData({
      id: node.id,
      fields: (node.fields ?? []) as MetaobjectField[],
    });
    if (!parsed) return;

    slides.push({
      id: parsed.id,
      title: parsed.title,
      subtitle: parsed.subtitle,
      cta: parsed.cta,
      image: parsed.image?.url
        ? {
            url: parsed.image.url,
            altText: parsed.image.altText ?? parsed.title,
            width: parsed.image.width ?? undefined,
            height: parsed.image.height ?? undefined,
          }
        : null,
    });
  });

  return slides;
}

async function loadCollectionProductsByHandle(
  storefront: Storefront,
  query: string,
  handleCandidates: readonly string[],
): Promise<CollectionProductList> {
  for (const handle of handleCandidates) {
    const response = await storefront.query(query, {
      variables: {handle},
      cache: storefront.CacheLong(),
    });
    const nodes = getCollectionProductNodes(response);
    if (nodes.length > 0) {
      return nodes;
    }
  }
  return [];
}

async function loadCuratedCollections(
  storefront: Storefront,
): Promise<FeaturedCollectionFragment[]> {
  const response = await storefront.query(FeaturedCollectionsQuery, {
    variables: {first: 24},
    cache: storefront.CacheLong(),
  });
  const collectionNodes: FeaturedCollectionFragment[] =
    response.collections?.nodes ?? [];
  return selectCuratedCollections(collectionNodes);
}

async function loadBestsellers(
  storefront: Storefront,
): Promise<CollectionProductList> {
  return loadCollectionProductsByHandle(
    storefront,
    BestsellersProductsQuery,
    BESTSELLERS_HANDLE_CANDIDATES,
  );
}

/**
 * Above-the-fold homepage data (hero + promo). Awaited before first paint / SEO meta.
 */
export async function loadHomepageCriticalData(storefront: Storefront) {
  const [heroResponse, promoResponse] = await Promise.all([
    storefront.query(HomeHeroQuery, {
      variables: {type: HOME_HERO_METAOBJECT_TYPE},
      cache: storefront.CacheLong(),
    }),
    storefront.query(HomePromoBannersQuery, {
      variables: {
        type: HOME_PROMO_BANNER_METAOBJECT_TYPE,
        first: 8,
      },
      cache: storefront.CacheLong(),
    }),
  ]);

  const heroNode = heroResponse?.metaobjects?.nodes?.[0] ?? null;
  const rawHero = heroNode
    ? buildHomeHeroData({
        fields: (heroNode.fields ?? []) as MetaobjectField[],
        locale: storefront.i18n.language,
        imageKey: 'image',
      })
    : null;

  const promoNodes = promoResponse?.metaobjects?.nodes ?? [];

  return {
    hero: rawHero && !isHeroEmpty(rawHero) ? rawHero : null,
    promoSlides: mapPromoMetaobjectsToSlides(promoNodes),
  };
}

/**
 * Below-the-fold homepage data. Returned as promises so the route can stream
 * without blocking TTFB. Errors are swallowed so the page still 200s.
 */
export function loadHomepageDeferredData(storefront: Storefront) {
  return {
    curatedCollections: loadCuratedCollections(storefront).catch(
      (error: Error) => {
        console.error(error);
        return [] as FeaturedCollectionFragment[];
      },
    ),
    bestsellers: loadBestsellers(storefront).catch((error: Error) => {
      console.error(error);
      return [] as CollectionProductList;
    }),
  };
}
