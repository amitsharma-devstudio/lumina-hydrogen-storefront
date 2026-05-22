import type {Storefront} from '@shopify/hydrogen';
import type {FeaturedCollectionFragment} from 'storefrontapi.generated';
import {FeaturedCollectionsQuery} from '~/graphql/queries/FeaturedCollectionsQuery';
import {HomeHeroQuery} from '~/graphql/queries/HomeHeroQuery';
import {BestsellersProductsQuery} from '~/graphql/queries/BestsellersProductsQuery';
import {NewArrivalsProductsQuery} from '~/graphql/queries/NewArrivalsProductsQuery';
import {buildHomeHeroData, type MetaobjectField} from '~/lib/homepage';
import {getCollectionProductNodes} from '~/components/home/productsSection.types';

export const HOME_HERO_METAOBJECT_TYPE = 'home_hero';
export const BESTSELLERS_COLLECTION_HANDLE = 'bestsellers';
export const NEW_ARRIVALS_COLLECTION_HANDLE = 'new-arrivals';

const HOMEPAGE_COLLECTION_EXCLUDE = new Set([
  BESTSELLERS_COLLECTION_HANDLE,
  NEW_ARRIVALS_COLLECTION_HANDLE,
]);

const CURATED_COLLECTION_HANDLES = [
  'cleansers',
  'serums',
  'moisturizers',
  'masks',
] as const;

export function selectCuratedCollections(
  nodes: FeaturedCollectionFragment[],
): FeaturedCollectionFragment[] {
  const byHandle = new Map(nodes.map((c) => [c.handle, c]));
  const curatedFromHandles = CURATED_COLLECTION_HANDLES.map(
    (handle) => byHandle.get(handle),
  ).filter((c): c is FeaturedCollectionFragment => Boolean(c));

  if (curatedFromHandles.length > 0) return curatedFromHandles;

  return nodes
    .filter((c) => !HOMEPAGE_COLLECTION_EXCLUDE.has(c.handle))
    .slice(0, 4);
}

export async function loadHomepageData(storefront: Storefront) {
  const [
    featuredCollectionsResponse,
    heroResponse,
    bestsellersResponse,
    newArrivalsResponse,
  ] = await Promise.all([
    storefront.query(FeaturedCollectionsQuery),
    storefront.query(HomeHeroQuery, {
      variables: {type: HOME_HERO_METAOBJECT_TYPE},
    }),
    storefront.query(BestsellersProductsQuery, {
      variables: {handle: BESTSELLERS_COLLECTION_HANDLE},
    }),
    storefront.query(NewArrivalsProductsQuery, {
      variables: {handle: NEW_ARRIVALS_COLLECTION_HANDLE},
    }),
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
    bestsellers: getCollectionProductNodes(bestsellersResponse),
    newArrivals: getCollectionProductNodes(newArrivalsResponse),
  };
}
