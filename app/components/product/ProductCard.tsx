import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';
import {ProductCardImageCarousel} from '~/components/home/ProductCardImageCarousel';
import type {ProductCardProduct} from '~/components/product/productCard.types';

export function ProductCard({product}: {product: ProductCardProduct}) {
  const variantUrl = useVariantUrl(product.handle);

  return (
    <article className="group/card flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)]">
      <ProductCardImageCarousel product={product} productUrl={variantUrl} />

      <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3.5">
        <Link
          to={variantUrl}
          prefetch="intent"
          className="flex flex-1 flex-col justify-between gap-2.5"
        >
          <h3 className="line-clamp-2 text-[13px] font-medium leading-snug tracking-tight text-neutral-900 transition-colors group-hover/card:text-black sm:text-sm">
            {product.title}
          </h3>
          <div className="flex items-baseline justify-between gap-2 border-t border-neutral-100 pt-2.5">
            <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-neutral-400">
              From
            </span>
            <Money
              data={product.priceRange.minVariantPrice}
              className="text-base font-light tabular-nums tracking-tight text-neutral-900"
            />
          </div>
        </Link>
      </div>
    </article>
  );
}
