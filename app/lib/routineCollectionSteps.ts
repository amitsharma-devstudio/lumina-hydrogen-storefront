import type {
  RoutineBundleStep,
  RoutineProductOption,
  RoutineStepType,
} from '~/lib/routineBundles.types';
import {ROUTINE_STEP_TYPES} from '~/lib/routineBundles.types';

export type RoutineCollectionProduct = {
  handle: string;
  title: string;
  routineStepType?: string | null;
  imageUrl?: string | null;
  imageAlt?: string | null;
  price?: {amount: string; currencyCode: string} | null;
};

function normalizeStepToken(raw: string): RoutineStepType | null {
  const token = raw.trim().toLowerCase();
  if (token === 'cleanse' || token === 'cleanser') return 'Cleanse';
  if (token === 'treat' || token === 'treatment' || token === 'serum') {
    return 'Treat';
  }
  if (token === 'moisturize' || token === 'moisturizer' || token === 'moisturise') {
    return 'Moisturize';
  }
  return null;
}

export function inferRoutineStepType(
  product: RoutineCollectionProduct,
): RoutineStepType | null {
  if (!product.routineStepType) return null;
  return normalizeStepToken(product.routineStepType);
}

const STEP_NOTES: Record<RoutineStepType, string> = {
  Cleanse: 'Choose your cleanse.',
  Treat: 'Choose your treatment step.',
  Moisturize: 'Choose how you finish your routine.',
};

export function buildRoutineStepsFromCollectionProducts(
  products: RoutineCollectionProduct[],
): RoutineBundleStep[] {
  const buckets: Record<RoutineStepType, RoutineProductOption[]> = {
    Cleanse: [],
    Treat: [],
    Moisturize: [],
  };

  for (const product of products) {
    const stepType = inferRoutineStepType(product);
    if (!stepType) continue;
    buckets[stepType].push({
      productTitle: product.title,
      productHandle: product.handle,
      imageUrl: product.imageUrl,
      imageAlt: product.imageAlt,
      price: product.price,
    });
  }

  return ROUTINE_STEP_TYPES.map((stepType, index) => ({
    label: `0${index + 1}`,
    step: stepType,
    note: STEP_NOTES[stepType],
    options: buckets[stepType],
  })).filter((step) => step.options.length > 0);
}

export function parseCollectionProductNodes(
  nodes: Array<{
    handle?: string | null;
    title?: string | null;
    routineStepType?: {value?: string | null} | null;
    featuredImage?: {
      url?: string | null;
      altText?: string | null;
    } | null;
    images?: {nodes?: Array<{url?: string | null; altText?: string | null}>} | null;
    priceRange?: {
      minVariantPrice?: {amount?: string; currencyCode?: string} | null;
    } | null;
  }>,
): RoutineCollectionProduct[] {
  return nodes
    .filter((node): node is {handle: string; title?: string | null} =>
      Boolean(node.handle),
    )
    .map((node) => {
      const image =
        node.featuredImage?.url ?? node.images?.nodes?.[0]?.url ?? null;
      const imageAlt =
        node.featuredImage?.altText ??
        node.images?.nodes?.[0]?.altText ??
        node.title ??
        null;
      const minPrice = node.priceRange?.minVariantPrice;

      return {
        handle: node.handle,
        title: node.title ?? node.handle,
        routineStepType: node.routineStepType?.value ?? null,
        imageUrl: image,
        imageAlt,
        price:
          minPrice?.amount && minPrice?.currencyCode
            ? {amount: minPrice.amount, currencyCode: minPrice.currencyCode}
            : null,
      };
    });
}
