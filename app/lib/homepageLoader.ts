import type {Storefront} from '@shopify/hydrogen';
import type {FeaturedCollectionFragment} from 'storefrontapi.generated';
import {FeaturedCollectionsQuery} from '~/graphql/queries/FeaturedCollectionsQuery';
import {HomeHeroQuery} from '~/graphql/queries/HomeHeroQuery';
import {HomePromoBannersQuery} from '~/graphql/queries/HomePromoBannersQuery';
import {BestsellersProductsQuery} from '~/graphql/queries/BestsellersProductsQuery';
import {NewArrivalsProductsQuery} from '~/graphql/queries/NewArrivalsProductsQuery';
import {
  buildHomeHeroData,
  buildHomePromoBannerData,
  type MetaobjectField,
} from '~/lib/homepage';
import {
  FALLBACK_HOME_PROMO_SLIDES,
  resolveHomeHero,
  resolveHomePromoSlides,
  type HomePromoSlide,
} from '~/lib/homepageFallbacks';
import {getCollectionProductNodes} from '~/components/home/productsSection.types';
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

  nodes.forEach((node, index) => {
    const parsed = buildHomePromoBannerData({
      id: node.id,
      fields: (node.fields ?? []) as MetaobjectField[],
    });
    if (!parsed) return;

    const fallbackImage =
      FALLBACK_HOME_PROMO_SLIDES[index % FALLBACK_HOME_PROMO_SLIDES.length]
        ?.image ?? FALLBACK_HOME_PROMO_SLIDES[0].image;

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
        : fallbackImage,
    });
  });

  return slides;
}

async function loadCollectionProductsByHandle(
  storefront: Storefront,
  query: string,
  handleCandidates: readonly string[],
) {
  for (const handle of handleCandidates) {
    const response = await storefront.query(query, {variables: {handle}});
    const nodes = getCollectionProductNodes(response);
    if (nodes.length > 0) {
      return nodes;
    }
  }
  return [];
}

export async function loadHomepageData(storefront: Storefront) {
  const [
    featuredCollectionsResponse,
    heroResponse,
    promoResponse,
    bestsellers,
    newArrivals,
  ] = await Promise.all([
    storefront.query(FeaturedCollectionsQuery, {
      variables: {first: 24},
    }),
    storefront.query(HomeHeroQuery, {
      variables: {type: HOME_HERO_METAOBJECT_TYPE},
    }),
    storefront.query(HomePromoBannersQuery, {
      variables: {
        type: HOME_PROMO_BANNER_METAOBJECT_TYPE,
        first: 8,
      },
    }),
    loadCollectionProductsByHandle(
      storefront,
      BestsellersProductsQuery,
      BESTSELLERS_HANDLE_CANDIDATES,
    ),
    loadCollectionProductsByHandle(
      storefront,
      NewArrivalsProductsQuery,
      NEW_ARRIVALS_HANDLE_CANDIDATES,
    ),
  ]);

  const collectionNodes: FeaturedCollectionFragment[] =
    featuredCollectionsResponse.collections?.nodes ?? [];

  const heroNode = heroResponse?.metaobjects?.nodes?.[0] ?? null;
  const rawHero = heroNode
    ? buildHomeHeroData({
        fields: (heroNode.fields ?? []) as MetaobjectField[],
        locale: storefront.i18n.language,
        imageKey: 'image',
      })
    : null;

  const promoNodes = promoResponse?.metaobjects?.nodes ?? [];
  const cmsPromoSlides = mapPromoMetaobjectsToSlides(promoNodes);

  return {
    curatedCollections: selectCuratedCollections(collectionNodes),
    hero: resolveHomeHero(rawHero),
    promoSlides: resolveHomePromoSlides(cmsPromoSlides),
    bestsellers,
    newArrivals,
  };
}
