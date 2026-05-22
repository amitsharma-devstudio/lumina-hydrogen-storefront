import {Link} from 'react-router';
import {Image, Money, type OptimisticCartLine} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {getVariantUrl} from '~/lib/variants';
import {Button} from '~/components/ui/Button';
import {controlHeightClass} from '~/lib/theme';
import {
  CartLineRemoveForm,
  CartLineUpdateForm,
} from '~/components/cart/cartLineMutations';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

function formatVariantLabel(
  options: Array<{name: string; value: string}>,
  fallbackTitle?: string | null,
) {
  if (options.length) {
    return options.map((option) => option.value).join(' · ');
  }
  if (fallbackTitle && fallbackTitle !== 'Default Title') {
    return fallbackTitle;
  }
  return null;
}

export function CartPageLineItem({line}: {line: CartLine}) {
  const {id: lineId, quantity, isOptimistic, merchandise, cost} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const prevQuantity = Math.max(0, quantity - 1);
  const nextQuantity = quantity + 1;
  const variantLabel = formatVariantLabel(selectedOptions, title);

  const productUrl = getVariantUrl({
    handle: product.handle,
    pathname: '/',
    searchParams: new URLSearchParams(),
    selectedOptions,
  });

  return (
    <article className="rounded-2xl border border-neutral-200 p-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:gap-6">
        <Link
          to={productUrl}
          prefetch="intent"
          className="h-48 w-full shrink-0 overflow-hidden rounded-xl bg-neutral-100 sm:h-32 sm:w-32"
        >
          {image ? (
            <Image
              data={image}
              aspectRatio="1/1"
              sizes="128px"
              className="h-full w-full object-cover"
              alt={title}
            />
          ) : null}
        </Link>

        <div className="flex flex-1 flex-col">
          <div className="mb-4 flex justify-between gap-4">
            <div className="min-w-0">
              <Link
                to={productUrl}
                prefetch="intent"
                className="font-medium text-neutral-900 transition-colors hover:text-primary"
              >
                {product.title}
              </Link>
              {variantLabel ? (
                <p className="mt-1 text-sm text-neutral-500">{variantLabel}</p>
              ) : null}
            </div>
            <p className="shrink-0 font-medium tabular-nums text-neutral-900">
              <Money data={cost.totalAmount} />
            </p>
          </div>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
            <div
              className={`flex ${controlHeightClass} items-stretch overflow-hidden rounded-sm border border-neutral-300 bg-white`}
            >
              <CartLineUpdateForm lines={[{id: lineId, quantity: prevQuantity}]}>
                <button
                  type="submit"
                  aria-label="Decrease quantity"
                  disabled={quantity <= 1 || Boolean(isOptimistic)}
                  className="flex h-full w-10 items-center justify-center text-neutral-500 transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                >
                  −
                </button>
              </CartLineUpdateForm>
              <span
                className="flex min-w-[2.5rem] items-center justify-center border-x border-neutral-200 text-sm font-medium tabular-nums text-black"
                aria-live="polite"
              >
                {quantity}
              </span>
              <CartLineUpdateForm lines={[{id: lineId, quantity: nextQuantity}]}>
                <button
                  type="submit"
                  aria-label="Increase quantity"
                  disabled={Boolean(isOptimistic)}
                  className="flex h-full w-10 items-center justify-center text-neutral-500 transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
                >
                  +
                </button>
              </CartLineUpdateForm>
            </div>

            <CartLineRemoveForm lineIds={[lineId]} disabled={Boolean(isOptimistic)}>
              <Button
                type="submit"
                variant="link"
                disabled={Boolean(isOptimistic)}
              >
                Remove
              </Button>
            </CartLineRemoveForm>
          </div>
        </div>
      </div>
    </article>
  );
}
