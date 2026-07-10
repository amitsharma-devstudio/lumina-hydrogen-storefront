import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import {AddToCartButton} from '~/components/AddToCartButton';
import type {CartUpsellItem, CartUpsells} from '~/lib/loadCartUpsells';
import {btnSecondaryClass} from '~/lib/theme';

function UpsellEyebrow({item}: {item: CartUpsellItem}) {
  if (item.source === 'bestseller') {
    return (
      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-neutral-500">
        Popular pick
      </p>
    );
  }

  if (item.category !== 'Step') {
    return (
      <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-primary">
        Step {item.step} · {item.category}
      </p>
    );
  }

  return (
    <p className="text-[10px] font-medium uppercase tracking-[0.12em] text-primary">
      Also in this routine
    </p>
  );
}

export function CartUpsellsSection({upsells}: {upsells: CartUpsells}) {
  if (!upsells.items.length) return null;

  const isRegimen = upsells.items[0]?.source === 'regimen';

  return (
    <section
      aria-labelledby="cart-upsells-heading"
      className="cart-upsells-section rounded-2xl border border-neutral-200 bg-neutral-50/60"
    >
      <header className="mb-6">
        <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-500">
          {isRegimen ? 'Routine builder' : 'Recommended'}
        </p>
        <h2
          id="cart-upsells-heading"
          className="mt-2 text-xl font-light tracking-tight text-neutral-900 sm:text-2xl"
        >
          {upsells.title}
        </h2>
        {upsells.description ? (
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-neutral-600">
            {upsells.description}
          </p>
        ) : null}
      </header>

      <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {upsells.items.map((item) => (
          <li
            key={item.id}
            className="flex gap-4 rounded-xl border border-neutral-200/90 bg-white p-5"
          >
            <Link
              to={`/products/${item.handle}`}
              prefetch="intent"
              className="h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-neutral-100"
            >
              {item.featuredImage?.url ? (
                <Image
                  data={item.featuredImage}
                  aspectRatio="1/1"
                  sizes="80px"
                  className="h-full w-full object-cover"
                  alt={item.title}
                />
              ) : null}
            </Link>

            <div className="flex min-w-0 flex-1 flex-col">
              <UpsellEyebrow item={item} />
              <Link
                to={`/products/${item.handle}`}
                prefetch="intent"
                className="mt-1.5 line-clamp-2 text-sm font-medium text-neutral-900 hover:text-primary"
              >
                {item.title}
              </Link>
              {item.priceRange?.minVariantPrice ? (
                <p className="mt-1.5 text-sm tabular-nums text-neutral-600">
                  <Money data={item.priceRange.minVariantPrice} />
                </p>
              ) : null}

              <div className="mt-auto pt-4">
                <AddToCartButton
                  lines={[{merchandiseId: item.variantId, quantity: 1}]}
                  className={`${btnSecondaryClass} !h-9 min-h-9 w-full !px-4 !py-0 text-xs`}
                >
                  Add to cart
                </AddToCartButton>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
