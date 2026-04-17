import { useState } from 'react';

import { Money } from '@shopify/hydrogen';


import { ProductCard } from './ProductCard';
import { ImageGallery } from '~/components/ui/ImageGallery';
import { VariantPicker } from '~/components/VariantPicker';
import { AddToCartButton } from '~/components/AddToCartButton';
import { Accordion } from '~/components/ui/Accordion';
import { CompleteTheRoutine } from '~/components/CompleteTheRoutine';

// ==================== CONSTANTS ====================

const PRODUCT_IMAGES = [
  'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=800',
  'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=800',
  'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=800',
  'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=800'
];

const SIZE_OPTIONS = [
  { id: 'size-30ml', label: '30ml', price: 68 },
  { id: 'size-50ml', label: '50ml', price: 98 }
];

const PRODUCT_BENEFITS = [
  { id: 1, text: 'Free shipping on orders over $75' },
  { id: 2, text: '30-day money-back guarantee' },
  { id: 3, text: 'Cruelty-free and vegan' }
];

const ACCORDION_ITEMS = [
  {
    id: 'ingredients',
    title: 'Ingredients',
    content: 'Water, Sodium Hyaluronate (High, Medium, Low Molecular Weight), Glycerin, Pentylene Glycol, Panthenol, Sodium PCA, Allantoin, Phenoxyethanol, Ethylhexylglycerin'
  },
  {
    id: 'how-to-use',
    title: 'How to Use',
    content: 'Apply 2-3 drops to clean, damp skin morning and evening. Gently press into skin until absorbed. Follow with moisturizer. Can be used daily.'
  },
  {
    id: 'shipping',
    title: 'Shipping & Returns',
    content: 'Free standard shipping on orders over $75. Orders ship within 1-2 business days. 30-day return policy for unopened products.'
  }
];

const RELATED_PRODUCTS = [
  { id: 2, name: 'Gentle Foaming Cleanser', category: 'Cleanser', price: 45, image: 'https://images.unsplash.com/photo-1598440947619-2c35fc9aa908?w=600', rating: 4.7, reviews: 189 },
  { id: 4, name: 'Vitamin C Brightening Serum', category: 'Serum', price: 75, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=600', rating: 4.6, reviews: 156 },
  { id: 6, name: 'Niacinamide Serum', category: 'Serum', price: 58, image: 'https://images.unsplash.com/photo-1556228720-195a672e8a03?w=600', badge: 'BESTSELLER', rating: 4.8, reviews: 267 }
];

// MetaFields.
const HERO_CLAIM = "Clinically proven 72-hour hydration";

const INGREDIENT_BLEND = [
  {
    name: "Hyaluronic Acid",
    inci: "Sodium Hyaluronate",
    percentage: "2%",
    molecularWeight: "Multi-weight",
    target: "Multi-layer hydration",
  },
  {
    name: "Panthenol",
    inci: "Pro-Vitamin B5",
    percentage: "1%",
    target: "Barrier repair",
  },
];

const ROUTINE_INFO = {
  step: 2,
  label: "Hydration Step",
  use: "AM & PM",
};

const COMPATIBILITY = {
  safeWith: ["Niacinamide", "Ceramides"],
  avoidWith: ["Pure Vitamin C (L-Ascorbic Acid)"],
};


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
  onQuickAdd,
}: {
  products: any[];
  onQuickAdd: (product: any) => void;
}) => (
  <div className="mt-20">
    <h2 className="mb-8 text-5xl font-light tracking-tight text-black">
      You May Also Like
    </h2>
    <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product: any) => (
        <ProductCard key={product.id} product={product} onQuickAdd={onQuickAdd} />
      ))}
    </div>
  </div>
);

// Ingredient Compatibility Engine
function checkConflicts(currentProduct: any, routineProducts: any[]) {
  const conflicts: any[] = [];

  currentProduct.ingredients.forEach((ingredient: any) => {
    routineProducts.forEach((product: any) => {
      product.ingredients.forEach((otherIngredient: any) => {
        if (
          ingredient.conflicts_with.includes(otherIngredient.id)
        ) {
          conflicts.push({
            ingredient: ingredient.name,
            conflictsWith: otherIngredient.name,
            product: product.title
          });
        }
      });
    });
  });

  return conflicts;
}

const CompatibilityWarning = ({ conflicts }: {conflicts: any[]}) => {
  if (!conflicts.length) return null;

  return (
    <section
      role="alert"
      className="mt-8 rounded-xl border border-red-200 bg-red-50 p-6"
    >
      <h3 className="text-lg font-medium text-red-800">
        Ingredient Compatibility Notice
      </h3>

      <ul className="mt-4 space-y-2 text-sm text-red-700">
        {conflicts.map((conflict: any, index: number) => (
          <li key={index}>
            {conflict.ingredient} may react with {conflict.conflictsWith} in{" "}
            {conflict.product}
          </li>
        ))}
      </ul>
    </section>
  );
};

const IngredientBlend = ({ ingredients }: {ingredients: any[]}) => (
  <section aria-labelledby="ingredient-blend" className="mt-6">
    <h3 id="ingredient-blend" className="text-sm font-medium text-black">
      Key Active Ingredients
    </h3>

    <ul className="mt-3 space-y-2 text-sm text-gray-600">
      {ingredients.map((ing, idx) => (
        <li key={idx}>
          <strong className="text-black">{ing.name}</strong>{" "}
          <span className="text-gray-500">
            ({ing.inci}) — {ing.target}
          </span>
        </li>
      ))}
    </ul>
  </section>
);

const RoutinePlacement = ({ routine }: {routine: any}) => (
  <section className="mt-6 rounded-xl border border-gray-200 p-4">
    <p className="text-sm text-gray-600">
      <strong className="text-black">
        Step {routine.step}: {routine.label}
      </strong>
    </p>
    <p className="mt-1 text-sm text-gray-500">
      Use in your routine: {routine.use}
    </p>
  </section>
);

const CompatibilityInfo = ({ data }: {data: any}) => (
  <section
    className="mt-6 rounded-xl bg-gray-50 p-4 text-sm"
    aria-label="Ingredient compatibility"
  >
    <p className="text-gray-700">
      <strong>Safe to use with:</strong>{" "}
      {data.safeWith.join(", ")}
    </p>

    <p className="mt-2 text-gray-700">
      <strong>Avoid pairing with:</strong>{" "}
      {data.avoidWith.join(", ")}
    </p>
  </section>
);



// ==================== MAIN PDP COMPONENT ====================
interface ProductDetailPageProps {
  product: any;
}


export const ProductDetailPage = ({ product }: ProductDetailPageProps) => {

  const [selectedSize, setSelectedSize] = useState(SIZE_OPTIONS[0]);
  const [quantity, setQuantity] = useState(1);

  const images = (product.images?.nodes ?? []).map((node: any) => ({...node}));
  const rating = product?.rating?.value
    ? parseFloat(String(product.rating.value))
    : 0;
  const reviewCount = product?.reviewCount?.value
    ? parseInt(String(product.reviewCount.value), 10)
    : 0;
  const description = product.descriptionHtml || product.description || '';
  const selectedVariant= product.selectedOrFirstAvailableVariant

  const [selectedImage, setSelectedImage] = useState(images?.[0] || {});

  const handleAddToCart = () => {
    const cartItem = {
      name: 'Hyaluronic Acid Serum',
      size: selectedSize.label,
      price: selectedSize.price,
      quantity: quantity,
      total: selectedSize.price * quantity
    };
    console.log('Add to cart:', cartItem);
    alert(`Added ${quantity} × ${selectedSize.label} to cart!`);
  };

  const handleQuickAdd = (product: any) => {
    console.log('Quick add:', product);
    alert(`Added ${product.name} to cart!`);
  };

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
            <ProductRating rating={rating} reviewCount={reviewCount} />

            {/* Price */}
            <div className="text-3xl font-light text-black">
              {selectedVariant?.price ? <Money data={selectedVariant.price} /> : null}
            </div>

            {/* Hero Claim (Metafield) */}
            <p className="text-sm font-medium text-black">
              {HERO_CLAIM}
            </p>

            {/* Description */}
            <div className="leading-relaxed text-gray-600" >
              {description}
            </div>
            {/* Ingredient Blend */}
            <IngredientBlend ingredients={INGREDIENT_BLEND} />

            {/* Routine Placement */}
            <RoutinePlacement routine={ROUTINE_INFO} />

            {/* Compatibility */}
            <CompatibilityInfo data={COMPATIBILITY} />

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
      {true && (
        <Accordion title="How to Use">
          <p>{'howToUse'}</p>
        </Accordion>
      )}

      {/* Dynamic Metafield: Ingredients */}
      {/* {ingredients && (
        <Accordion title="Full Ingredients">
          <p>{ingredients}</p>
        </Accordion>
      )} */}

      {/* Static/Policy Info */}
      <Accordion title="Shipping & Returns">
        <p>{'shippingPolicy'}</p>
      </Accordion>
    </div>

            {/* Accordion */}
            {/* <Accordion items={ACCORDION_ITEMS} /> */}
          </div>

        </div>

        {/* Related Products */}
        <CompleteTheRoutine />
        <RelatedProducts products={RELATED_PRODUCTS} onQuickAdd={handleQuickAdd} />
      </section>
    </main>
  );
};

export default ProductDetailPage;