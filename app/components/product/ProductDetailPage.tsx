import {useState} from 'react';
import {Money, type MappedProductOptions} from '@shopify/hydrogen';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
import {ImageGallery} from '~/components/ui/ImageGallery';
import {VariantPicker} from '~/components/VariantPicker';
import {Accordion} from '~/components/ui/Accordion';
import {CompleteTheRoutine} from '~/components/CompleteTheRoutine';
import {
  CompatibilityCard,
  IngredientBlendCard,
  RoutinePlacementCard,
} from '~/components/product/SkincareIntelligence';
import {ProductRating} from '~/components/product/ProductRating';
import {ProductBenefitsList} from '~/components/product/ProductBenefitsList';
import {ProductRecommendations} from '~/components/product/ProductRecommendations';
import {ProductCartActions} from '~/components/product/ProductCartActions';
import {RegimenQuickStrip} from '~/components/product/RegimenQuickStrip';
import {buildSkincareIntelligence} from '~/lib/skincare';
import {isVariantPurchasable} from '~/lib/variantAvailability';
import type {CollectionProductList} from '~/components/home/productsSection.types';

type ProductDetailPageProps = {
  product: {
    title: string;
    handle: string;
    description?: string | null;
    descriptionHtml?: string | null;
    images?: {nodes?: Array<Record<string, unknown>>};
    productOptions?: MappedProductOptions[];
    selectedOrFirstAvailableVariant?: {
      id: string;
      title?: string | null;
      availableForSale: boolean;
      quantityAvailable?: number | null;
      selectedOptions?: Array<{name: string; value: string}>;
      price?: {amount: string; currencyCode: CurrencyCode};
    } | null;
    [key: string]: unknown;
  };
  recommendations: CollectionProductList;
};

export function ProductDetailPage({
  product,
  recommendations,
}: ProductDetailPageProps) {
  const skincare = buildSkincareIntelligence(product);
  const images = (product.images?.nodes ?? []).map((node) => ({...node}));
  const selectedVariant = product.selectedOrFirstAvailableVariant;
  const hasDescriptionHtml = Boolean(product.descriptionHtml?.trim());
  const canAddToCart = Boolean(
    selectedVariant?.id && isVariantPurchasable(selectedVariant),
  );

  const [selectedImage, setSelectedImage] = useState(
    (images[0] ?? {}) as Record<string, unknown>,
  );

  return (
    <main className="bg-white pt-6 pb-16 lg:pt-8">
      <section className="mx-auto max-w-7xl px-4 sm:px-6">
        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-2 lg:gap-10">
          <ImageGallery
            images={images}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />

          <div className="flex min-w-0 flex-col gap-5 pl-2 sm:pl-4 lg:pl-8 lg:pr-2">
            <div className="flex flex-col gap-3">
              <h1 className="text-3xl font-light tracking-tight text-black lg:text-4xl">
                {product.title}
              </h1>

              <ProductRating
                rating={skincare.rating}
                reviewCount={skincare.reviewCount}
              />

              <div className="text-2xl font-light text-black lg:text-3xl">
                {selectedVariant?.price ? (
                  <Money data={selectedVariant.price} />
                ) : null}
              </div>

              {skincare.heroClaim ? (
                <p className="text-sm font-medium text-black">
                  {skincare.heroClaim}
                </p>
              ) : null}
            </div>

            <div className="product-actions flex flex-col gap-5 border-t border-neutral-100 pt-5">
              <VariantPicker options={product.productOptions ?? []} />

              <div className="px-0.5">
                <ProductCartActions
                  productTitle={product.title}
                  productHandle={product.handle}
                  selectedVariant={selectedVariant}
                  canAddToCart={canAddToCart}
                />
              </div>

              <ProductBenefitsList benefits={skincare.benefits} />

              {skincare.regimen ? (
                <RegimenQuickStrip
                  regimen={skincare.regimen}
                  currentHandle={product.handle}
                />
              ) : null}
            </div>

            {hasDescriptionHtml ? (
              <div
                className="prose prose-neutral max-w-none text-sm leading-relaxed text-gray-600"
                dangerouslySetInnerHTML={{__html: product.descriptionHtml!}}
              />
            ) : product.description ? (
              <p className="text-sm leading-relaxed text-gray-600">
                {product.description}
              </p>
            ) : null}

            <IngredientBlendCard ingredients={skincare.ingredients} />

            {skincare.routine ? (
              <RoutinePlacementCard routine={skincare.routine} />
            ) : null}

            <CompatibilityCard
              skinTypes={skincare.skinTypes}
              safeWith={skincare.safeWith}
              avoidWith={skincare.avoidWith}
            />

            <div className="border-t border-gray-200">
              {skincare.howToUse ? (
                <Accordion title="How to Use">
                  <p className="whitespace-pre-line">{skincare.howToUse}</p>
                </Accordion>
              ) : null}

              {skincare.fullIngredients ? (
                <Accordion title="Full Ingredients">
                  <p className="whitespace-pre-line">{skincare.fullIngredients}</p>
                </Accordion>
              ) : null}

              {skincare.shippingAndReturns ? (
                <Accordion title="Shipping & Returns">
                  <p className="whitespace-pre-line">
                    {skincare.shippingAndReturns}
                  </p>
                </Accordion>
              ) : null}
            </div>
          </div>
        </div>

        {skincare.regimen ? (
          <CompleteTheRoutine
            regimen={skincare.regimen}
            currentHandle={product.handle}
          />
        ) : null}

        <ProductRecommendations products={recommendations} />
      </section>
    </main>
  );
}

export default ProductDetailPage;
