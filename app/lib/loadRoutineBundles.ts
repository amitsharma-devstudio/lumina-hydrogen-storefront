import type {Storefront} from '@shopify/hydrogen';
import {RoutineCollectionProductsQuery} from '~/graphql/queries/RoutineCollectionProductsQuery';
import {ROUTINE_BUNDLE_CONFIG} from '~/lib/routineBundleConfig';
import {
  buildRoutineStepsFromCollectionProducts,
  parseCollectionProductNodes,
} from '~/lib/routineCollectionSteps';
import {paletteForTheme, type RoutineBundle} from '~/lib/routineBundles.types';

const PRODUCTS_FIRST = 50;

async function loadCollectionProducts(
  storefront: Storefront,
  handle: string,
) {
  const response = await storefront.query(RoutineCollectionProductsQuery, {
    variables: {handle, first: PRODUCTS_FIRST},
  });
  return parseCollectionProductNodes(
    response?.collection?.products?.nodes ?? [],
  );
}

export async function loadRoutineBundles(
  storefront: Storefront,
): Promise<RoutineBundle[]> {
  const bundles = await Promise.all(
    ROUTINE_BUNDLE_CONFIG.map(async (config) => {
      const products = await loadCollectionProducts(
        storefront,
        config.collectionHandle,
      );
      const steps = buildRoutineStepsFromCollectionProducts(products);
      if (steps.length === 0) return null;

      return {
        id: `routine-${config.bundleKey}`,
        handle: config.collectionHandle,
        bundleKey: config.bundleKey,
        goal: config.goal,
        eyebrow: config.eyebrow,
        title: config.title,
        description: config.description,
        bestFor: config.bestFor,
        result: config.result,
        price: config.price,
        collectionPath: `/collections/${config.collectionHandle}`,
        ctaLabel: config.ctaLabel,
        palette: paletteForTheme(config.bundleKey),
        sortOrder: config.sortOrder,
        steps,
      } satisfies RoutineBundle;
    }),
  );

  return bundles.filter((b): b is RoutineBundle => Boolean(b));
}
