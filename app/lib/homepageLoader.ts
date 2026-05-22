import type {Storefront} from '@shopify/hydrogen';
import type {FeaturedCollectionFragment} from 'storefrontapi.generated';
import {FeaturedCollectionsQuery} from '~/graphql/queries/FeaturedCollectionsQuery';
import {HomeHeroQuery} from '~/graphql/queries/HomeHeroQuery';
import {BestsellersProductsQuery} from '~/graphql/queries/BestsellersProductsQuery';
import {NewArrivalsProductsQuery} from '~/graphql/queries/NewArrivalsProductsQuery';
import {buildHomeHeroData, type MetaobjectField} from '~/lib/homepage';
import {getCollectionProductNodes} from '~/components/home/productsSection.types';
import {
  BESTSELLERS_HANDLE_CANDIDATES,
  filterMerchandisingCollections,
  HOMEPAGE_CURATED_HANDLE_CANDIDATES,
  NEW_ARRIVALS_HANDLE_CANDIDATES,
  resolveCollectionHandle,
} from '~/lib/storeCollections';

export const HOME_HERO_METAOBJECT_TYPE = 'home_hero';

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
  const [featuredCollectionsResponse, heroResponse, bestsellers, newArrivals] =
    await Promise.all([
      storefront.query(FeaturedCollectionsQuery, {
        variables: {first: 24},
      }),
      storefront.query(HomeHeroQuery, {
        variables: {type: HOME_HERO_METAOBJECT_TYPE},
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

  return {
    curatedCollections: selectCuratedCollections(collectionNodes),
    hero: heroNode
      ? buildHomeHeroData({
          fields: (heroNode.fields ?? []) as MetaobjectField[],
          locale: storefront.i18n.language,
          imageKey: 'image',
        })
      : null,
    bestsellers,
    newArrivals,
  };
}
