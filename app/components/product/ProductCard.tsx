import { useState } from 'react';

export function ProductCard ({ product, onQuickAdd }) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  return (
    <article
      className="group cursor-pointer transition-transform duration-300 hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          console.log('Navigate to product:', product.id);
        }
      }}
      aria-label={`View ${product.name} details`}
    >
      {/* Image Container */}
      <div className="relative mb-4 overflow-hidden rounded-2xl bg-gray-100">
        {/* Aspect Ratio Container - 3:4 ratio */}
        <div className="relative aspect-[3/4]">
          {/* Loading Skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 animate-pulse bg-gray-200" />
          )}
          
          {/* Product Image */}
          <img
            src={product.image}
            alt={product.name}
            className={`h-full w-full object-cover transition-all duration-500 ${
              imageLoaded ? 'opacity-100' : 'opacity-0'
            } ${isHovered ? 'scale-105' : 'scale-100'}`}
            onLoad={() => setImageLoaded(true)}
            loading="lazy"
          />

          {/* Badge */}
          {product.badge && (
            <div
              className="absolute left-3 top-3 rounded-xl bg-white px-3 py-1.5 text-xs font-medium shadow-sm"
              aria-label={`Product badge: ${product.badge}`}
            >
              {product.badge}
            </div>
          )}

          {/* Quick Add Button */}
          <button
            className={`absolute bottom-3 left-3 right-3 rounded-lg bg-white px-4 py-3 text-sm font-medium shadow-md transition-opacity duration-300 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 ${
              isHovered ? 'opacity-100' : 'opacity-0'
            }`}
            onClick={(e) => {
              e.stopPropagation();
              onQuickAdd(product);
            }}
            aria-label={`Quick add ${product.name} to cart`}
          >
            Quick Add
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="flex flex-col gap-1">
        {/* Category */}
        <div className="text-xs uppercase tracking-wider text-gray-500">
          {product.category}
        </div>

        {/* Product Name */}
        <h3 className="text-lg font-normal text-black">
          {product.name}
        </h3>

        {/* Price */}
        <div className="mt-1 text-base text-black">
          ${product.price}
        </div>

        {/* Rating */}
        <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
          <span className="text-[10px] text-black" aria-hidden="true">
            ★★★★★
          </span>
          <span>
            {product.rating} ({product.reviews})
          </span>
          <span className="sr-only">
            Rated {product.rating} out of 5 stars based on {product.reviews} reviews
          </span>
        </div>
      </div>
    </article>
  );
};