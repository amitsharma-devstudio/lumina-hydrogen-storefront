import {useState} from 'react';

import {Money} from '@shopify/hydrogen';
import { ImageGallery } from '~/components/ui/ImageGallery';
import { VariantPicker } from '~/components/VariantPicker';
import { AddToCartButton } from '~/components/AddToCartButton';
import { Accordion } from '~/components/ui/Accordion';
import {CompleteTheRoutine} from '~/components/CompleteTheRoutine';
import {HomeProductCard} from '~/components/home/HomeProductCard';
import {
  CompatibilityCard,
  IngredientBlendCard,
  RoutinePlacementCard,
} from '~/components/product/SkincareIntelligence';
import {buildSkincareIntelligence} from '~/lib/skincare';

const PRODUCT_BENEFITS = [
  { id: 1, text: 'Free shipping on orders over $75' },
  { id: 2, text: '30-day money-back guarantee' },
  { id: 3, text: 'Cruelty-free and vegan' }
];

// ==================== SUB-COMPONENTS ====================

// Check Icon Component
const CheckIcon = () => (
  <svg 
    className="h-5 w-5 flex-shrink-0" 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2"
    aria-hidden="true"
  >
    <path d="M20 6L9 17l-5-5"></path>
  </svg>
);

// Image Gallery Component


// Product Rating Component
const ProductRating = ({
  rating,
  reviewCount,
}: {
  rating: number;
  reviewCount: number;
}) => (
  <div className="flex items-center gap-2 text-sm">
    <div className="flex items-center gap-1">
      <span className="text-black" aria-hidden="true">★★★★★</span>
      <span className="sr-only">Rated {rating} out of 5 stars</span>
    </div>
    <span className="text-gray-600">
      {rating} ({reviewCount} reviews)
    </span>
  </div>
);

// Size Selector Component
const SizeSelector = ({
  options,
  selectedSize,
  onSizeChange,
}: {
  options: Array<{id: string; label: string; price: number}>;
  selectedSize: {id: string; label: string; price: number};
  onSizeChange: (option: {id: string; label: string; price: number}) => void;
}) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-black">Size</label>
    <div className="flex flex-wrap gap-3" role="radiogroup" aria-label="Select product size">
      {options.map((option: {id: string; label: string; price: number}) => (
        <button
          key={option.id}
          onClick={() => onSizeChange(option)}
          className={`rounded-lg border px-6 py-3 text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
            selectedSize.id === option.id
              ? 'border-black bg-black text-white'
              : 'border-gray-300 bg-white text-black hover:border-black'
          }`}
          role="radio"
          aria-checked={selectedSize.id === option.id}
        >
          {option.label} - ${option.price}
        </button>
      ))}
    </div>
  </div>
);

// Quantity Selector Component
const QuantitySelector = ({
  quantity,
  onQuantityChange,
}: {
  quantity: number;
  onQuantityChange: (next: number) => void;
}) => (
  <div>
    <label htmlFor="quantity" className="mb-2 block text-sm font-medium text-black">
      Quantity
    </label>
    <div className="flex w-fit items-center gap-4 rounded-lg border border-gray-300 px-2 py-2">
      <button
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        className="px-3 py-1 text-xl transition-colors hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span 
        id="quantity"
        className="min-w-[30px] text-center text-base"
        aria-live="polite"
      >
        {quantity}
      </span>
      <button
        onClick={() => onQuantityChange(quantity + 1)}
        className="px-3 py-1 text-xl transition-colors hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  </div>
);

// Benefits List Component
const BenefitsList = ({
  benefits,
}: {
  benefits: Array<{id: number; text: string}>;
}) => (
  <ul className="flex flex-col gap-3" role="list">
    {benefits.map((benefit: {id: number; text: string}) => (
      <li key={benefit.id} className="flex items-center gap-3 text-sm text-gray-600">
        <CheckIcon />
        <span>{benefit.text}</span>
      </li>
    ))}
  </ul>
);

// Accordion Item Component
const AccordionItem = ({
  item,
  isOpen,
  onToggle,
}: {
  item: {id: string; title: string; content: string};
  isOpen: boolean;
  onToggle: () => void;
}) => (
  <div className="border-b border-gray-200">
    <button
      onClick={onToggle}
      className="flex w-full items-center justify-between py-5 text-left focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
      aria-expanded={isOpen}
      aria-controls={`accordion-content-${item.id}`}
    >
      <span className="font-medium text-black">{item.title}</span>
      <span className="text-xl" aria-hidden="true">
        {isOpen ? '−' : '+'}
      </span>
    </button>
    <div
      id={`accordion-content-${item.id}`}
      className={`overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 pb-5' : 'max-h-0'
      }`}
      role="region"
      aria-labelledby={`accordion-header-${item.id}`}
    >
      <p className="leading-relaxed text-gray-600">{item.content}</p>
    </div>
  </div>
);

// Accordion Component
// const Accordion = ({ items }) => {
//   const [openItemId, setOpenItemId] = useState(null);

//   const toggleItem = (itemId) => {
//     setOpenItemId(openItemId === itemId ? null : itemId);
//   };

//   return (
//     <div className="border-t border-gray-200">
//       {items.map((item) => (
//         <AccordionItem
//           key={item.id}
//           item={item}
//           isOpen={openItemId === item.id}
//           onToggle={() => toggleItem(item.id)}
//         />
//       ))}
//     </div>
//   );
// };

// Related Products Section Component
const RelatedProducts = ({
  products,
}: {
  products: any[];
}) => (
  <div className="mt-20">
    <h2 className="mb-8 text-5xl font-light tracking-tight text-black">
      You May Also Like
    </h2>
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product: any) => (
        <HomeProductCard key={product.id} product={product} />
      ))}
    </div>
  </div>
);

// ==================== MAIN PDP COMPONENT ====================
interface ProductDetailPageProps {
  product: any;
}


export const ProductDetailPage = ({ product }: ProductDetailPageProps) => {
  const skincare = buildSkincareIntelligence(product);
  const images = (product.images?.nodes ?? []).map((node: any) => ({...node}));
  const description = product.descriptionHtml || product.description || '';
  const selectedVariant = product.selectedOrFirstAvailableVariant;

  const [selectedImage, setSelectedImage] = useState(images?.[0] || {});

  return (
    <main className="min-h-screen bg-white py-20">
      <section className="mx-auto max-w-7xl px-6">
        {/* Product Details Grid */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-2">
          {/* Left Column - Image Gallery */}
          <ImageGallery
            images={images}
            selectedImage={selectedImage}
            onImageSelect={setSelectedImage}
          />

          {/* Right Column - Product Details */}
          <div className="flex flex-col gap-6">
            <div>
              <h1 className="text-4xl font-light tracking-tight text-black lg:text-5xl">
                {product.title}
              </h1>
            </div>

            {/* Rating */}
            <ProductRating
              rating={skincare.rating}
              reviewCount={skincare.reviewCount}
            />

            {/* Price */}
            <div className="text-3xl font-light text-black">
              {selectedVariant?.price ? <Money data={selectedVariant.price} /> : null}
            </div>

            {/* Hero Claim (Metafield) */}
            {skincare.heroClaim ? (
              <p className="text-sm font-medium text-black">{skincare.heroClaim}</p>
            ) : null}

            {/* Description */}
            <div className="leading-relaxed text-gray-600" >
              {description}
            </div>
            {/* Ingredient Blend */}
            <IngredientBlendCard ingredients={skincare.ingredients} />

            {skincare.routine ? (
              <RoutinePlacementCard routine={skincare.routine} />
            ) : null}

            <CompatibilityCard
              skinTypes={skincare.skinTypes}
              safeWith={skincare.safeWith}
              avoidWith={skincare.avoidWith}
            />

            {/* Options */}
            {/* <div className="flex flex-col gap-4 pt-4">
              <SizeSelector
                options={SIZE_OPTIONS}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
              />

              <QuantitySelector
                quantity={quantity}
                onQuantityChange={setQuantity}
              />
            </div> */}
            <div className="product-actions">
              <VariantPicker options={product.productOptions ?? []} />
              
              <div className="mt-8 w-full">
                <AddToCartButton
                  disabled={!selectedVariant || !selectedVariant.availableForSale}
                  lines={
                    selectedVariant
                      ? [
                          {
                            merchandiseId: selectedVariant.id,
                            quantity: 1,
                            selectedVariant,
                          },
                        ]
                      : []
                  }
                  className="w-full rounded-xl bg-black px-8 py-5 text-base font-medium text-white transition-opacity hover:opacity-80 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2"
                >
                  {selectedVariant?.availableForSale ? 'Add to cart' : 'This combination is currently out of stock.'}
                </AddToCartButton>
              </div>
            </div>

            {/* Benefits */}
            <BenefitsList benefits={PRODUCT_BENEFITS} />
            <div className="mt-12 border-t border-gray-200">
      {/* Dynamic Metafield: How to Use */}
      {skincare.howToUse ? (
        <Accordion title="How to Use">
          <p>{skincare.howToUse}</p>
        </Accordion>
      ) : null}

      {skincare.fullIngredients ? (
        <Accordion title="Full Ingredients">
          <p>{skincare.fullIngredients}</p>
        </Accordion>
      ) : null}

      {skincare.shippingAndReturns ? (
        <Accordion title="Shipping & Returns">
          <p>{skincare.shippingAndReturns}</p>
        </Accordion>
      ) : null}
    </div>

            {/* Accordion */}
            {/* <Accordion items={ACCORDION_ITEMS} /> */}
          </div>

        </div>

        {/* Related Products */}
        {skincare.regimen ? (
          <CompleteTheRoutine
            regimen={skincare.regimen}
            currentHandle={product.handle}
          />
        ) : null}
        <RelatedProducts products={product.recommendations ?? []} />
      </section>
    </main>
  );
};

export default ProductDetailPage;