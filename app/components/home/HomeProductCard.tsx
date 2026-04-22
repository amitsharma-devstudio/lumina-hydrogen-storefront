import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {useVariantUrl} from '~/lib/variants';

export function HomeProductCard({product}: {product: any}) {
  const variantUrl = useVariantUrl(product.handle);
  const image = product.featuredImage ?? product.images?.nodes?.[0] ?? null;

  return (
    <article className="group cursor-pointer transition-transform duration-300 hover:-translate-y-1">
      <Link to={variantUrl} prefetch="intent" className="block">
        <div className="relative mb-4 overflow-hidden rounded-3xl bg-neutral-50 ring-1 ring-black/5 transition-shadow duration-300 group-hover:shadow-[0_18px_55px_rgba(0,0,0,0.10)]">
          <div className="relative aspect-[3/4]">
            {image ? (
              <Image
                data={image}
                alt={image.altText || product.title}
                sizes="(min-width: 45em) 300px, 50vw"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center text-xs uppercase tracking-[0.15em] text-neutral-400">
                No image
              </div>
            )}

            <div className="pointer-events-none absolute inset-x-3 bottom-3 rounded-2xl bg-white/90 px-4 py-3 text-center text-sm font-medium text-black opacity-0 backdrop-blur-sm transition-opacity duration-300 group-hover:opacity-100">
              View details
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-normal tracking-tight text-black">
            {product.title}
          </h3>
          <div className="mt-1 text-base text-black">
            <Money data={product.priceRange.minVariantPrice} />
          </div>
        </div>
      </Link>
    </article>
  );
}

