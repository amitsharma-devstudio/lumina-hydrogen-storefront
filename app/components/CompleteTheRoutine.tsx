
import {Link} from 'react-router';
import {Image, Money, CartForm} from '@shopify/hydrogen';
import type {CurrencyCode} from '@shopify/hydrogen/storefront-api-types';
const MOCK_ROUTINE = [
  {
    id: '1',
    step: '01',
    category: 'Cleanse',
    title: 'Midnight Reset Cleanser',
    handle: 'midnight-reset-cleanser',
    featuredImage: {
      url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/products/soft-cleanser.jpg?v=1620000000',
      altText: 'Step 1',
    },
    priceRange: {
      minVariantPrice: { amount: '42.0', currencyCode: 'USD' as CurrencyCode },
    },
    variants: { nodes: [{ id: 'variant-1', availableForSale: true }] }
  },
  {
    id: '2',
    step: '02',
    category: 'Treat',
    title: 'Lumina Glow Serum (This Item)',
    handle: 'lumina-glow-serum',
    featuredImage: {
      url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/products/serum-bottle.jpg?v=1620000000',
      altText: 'Step 2',
    },
    priceRange: {
      minVariantPrice: { amount: '88.0', currencyCode: 'USD' as CurrencyCode },
    },
    variants: { nodes: [{ id: 'variant-2', availableForSale: true }] }
  },
  {
    id: '3',
    step: '03',
    category: 'Hydrate',
    title: 'Ceramide Barrier Cream',
    handle: 'ceramide-barrier-cream',
    featuredImage: {
      url: 'https://cdn.shopify.com/s/files/1/0551/4566/0472/products/cream-jar.jpg?v=1620000000',
      altText: 'Step 3',
    },
    priceRange: {
      minVariantPrice: { amount: '64.0', currencyCode: 'USD' as CurrencyCode },
    },
    variants: { nodes: [{ id: 'variant-3', availableForSale: true }] }
  },
];

export function CompleteTheRoutine({product}: {product?: any}) {
  const routineItems = MOCK_ROUTINE; // Testing with mock data
  const currentProductHandle = 'lumina-glow-serum'; // In reality: product.handle

  return (
    <section className="mt-32 border-t border-gray-100 pt-24 bg-[#FAFAFA]">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-serif italic mb-4">The Lumina Regimen</h2>
          <p className="max-w-md mx-auto text-gray-500 text-sm leading-relaxed">
            Our products are designed to work in synergy. Follow this 3-step sequence for optimal skin health.
          </p>
        </div>
        
        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-20">
          {/* THE LOGICAL BRIDGE: Connecting Line (Desktop Only) */}
          <div className="hidden md:block absolute top-[25%] left-0 w-full h-[1px] bg-gray-200 -z-0" />

          {itemLoop(routineItems, currentProductHandle)}
        </div>
      </div>
    </section>
  );
}

type RoutineItem = (typeof MOCK_ROUTINE)[number];

function itemLoop(items: RoutineItem[], currentHandle: string) {
  return items.map((item: RoutineItem) => {
    const isCurrent = item.handle === currentHandle;
    
    return (
      <div key={item.id} className="relative z-10 group flex flex-col items-center">
        {/* Step Indicator Badge */}
        <div className={`
          mb-6 flex flex-col items-center justify-center rounded-full w-14 h-14 border transition-all
          ${isCurrent ? 'bg-black border-black text-white' : 'bg-white border-gray-200 text-black'}
        `}>
          <span className="text-[10px] font-bold">{item.step}</span>
          <span className="text-[8px] uppercase tracking-tighter">{item.category}</span>
        </div>

        {/* Product Card */}
        <div className={`
          w-full p-4 rounded-sm transition-all duration-500
          ${isCurrent ? 'bg-white shadow-sm ring-1 ring-gray-100 scale-105' : 'opacity-80 grayscale-[0.5]'}
        `}>
          <div className="aspect-[4/5] bg-gray-50 mb-6 overflow-hidden">
            <Image data={item.featuredImage} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000" />
          </div>

          <h3 className="text-[10px] font-bold uppercase tracking-widest text-center h-8">
            {item.title}
          </h3>
          
          {/* Logic: Don't show Add to Cart for the product they are already on! */}
          {!isCurrent ? (
            <div className="mt-4 flex flex-col items-center">
               <Money data={item.priceRange.minVariantPrice} className="text-xs text-gray-500 mb-4" />
               <Link to={`/products/${item.handle}`} className="text-[10px] uppercase font-bold border-b border-black pb-1 hover:text-gray-400 hover:border-gray-400">
                  Add Step to Bag +
               </Link>
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center">
               <span className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">
                  Currently Viewing
               </span>
            </div>
          )}
        </div>
      </div>
    );
  });
}