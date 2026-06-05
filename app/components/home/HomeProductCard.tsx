import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';
import {ProductCardImageCarousel} from '~/components/home/ProductCardImageCarousel';
import type {CollectionProductNode} from '~/components/home/productsSection.types';
import {useVariantUrl} from '~/lib/variants';

const FALLBACK_BENEFITS = [
  'Barrier support',
  'Daily glow',
  'Sensitive-skin minded',
] as const;

function getHomeBenefitTags(product: CollectionProductNode) {
  const productTags = product.tags ?? [];
  const cleanedTags = productTags
    .filter((tag) => !tag.toLowerCase().includes('bestseller'))
    .filter((tag) => !tag.toLowerCase().includes('new'))
    .slice(0, 2);

  if (cleanedTags.length) return cleanedTags;

  const title = product.title.toLowerCase();
  if (title.includes('serum')) return ['Targeted active', 'Layerable'];
  if (title.includes('cleanser')) return ['Gentle cleanse', 'Barrier friendly'];
  if (title.includes('moistur')) return ['Deep hydration', 'Soft finish'];
  if (title.includes('mask')) return ['Reset ritual', 'Texture care'];

  return FALLBACK_BENEFITS.slice(0, 2);
}

/** Homepage product card (bestsellers, new arrivals, etc.) — separate from catalog PLP. */
export function HomeProductCard({product}: {product: CollectionProductNode}) {
  const productUrl = useVariantUrl(product.handle);
  const benefitTags = getHomeBenefitTags(product);

  return (
    <article className="group/card flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] transition duration-300 hover:-translate-y-0.5 hover:border-brand-100 hover:shadow-[0_14px_42px_rgba(28,25,23,0.08)]">
      <ProductCardImageCarousel
        product={product}
        productUrl={productUrl}
        variant="home"
      />

      <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3.5">
        <Link
          to={productUrl}
          prefetch="intent"
          className="flex flex-1 flex-col justify-between gap-3"
        >
          <div>
            <div className="mb-2 flex flex-wrap gap-1.5">
              {benefitTags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-brand-50 px-2 py-1 text-[9px] font-medium uppercase tracking-[0.12em] text-primary"
                >
                  {tag}
                </span>
              ))}
            </div>
            <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-neutral-900 transition-colors group-hover/card:text-black sm:text-sm">
              {product.title}
            </h3>
          </div>
          <div className="border-t border-neutral-100 pt-3">
            <div className="mb-2 flex items-center gap-1 text-[11px] text-neutral-500">
              <span className="text-primary" aria-hidden>
                ★★★★★
              </span>
              <span>Clinically considered</span>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                From
              </span>
              <Money
                data={product.priceRange.minVariantPrice}
                className="text-base font-light tabular-nums text-neutral-900"
              />
            </div>
          </div>
        </Link>
      </div>
    </article>
  );
}
