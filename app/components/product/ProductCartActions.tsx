import {Suspense, useEffect, useState} from 'react';
import {Await, useRouteLoaderData} from 'react-router';
import {
  CartForm,
  useOptimisticCart,
  type OptimisticCartLine,
} from '@shopify/hydrogen';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import type {RootLoader} from '~/root';
import {AddToCartButton} from '~/components/AddToCartButton';
import {btnPrimaryCompactClass} from '~/lib/theme';

type SelectedVariant = {
  id: string;
  title?: string | null;
  selectedOptions?: Array<{name: string; value: string}>;
};

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

const addButtonClass = btnPrimaryCompactClass;

function formatVariantLabel(
  options: Array<{name: string; value: string}> | undefined,
  fallbackTitle?: string | null,
) {
  if (options?.length) {
    return options.map((option) => option.value).join(' · ');
  }
  return fallbackTitle ?? '';
}

function getUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}

function CartLineUpdateForm({
  lines,
  children,
}: {
  lines: CartLineUpdateInput[];
  children: React.ReactNode;
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

function PremiumQuantityBox({
  quantity,
  onDecrease,
  onIncrease,
  decreaseDisabled,
  increaseDisabled,
  decreaseType = 'button',
  increaseType = 'button',
  decreaseForm,
  increaseForm,
}: {
  quantity: number;
  onDecrease?: () => void;
  onIncrease?: () => void;
  decreaseDisabled?: boolean;
  increaseDisabled?: boolean;
  decreaseType?: 'button' | 'submit';
  increaseType?: 'button' | 'submit';
  decreaseForm?: React.ReactNode;
  increaseForm?: React.ReactNode;
}) {
  const decControl =
    decreaseForm ??
    (onDecrease ? (
      <button
        type={decreaseType}
        onClick={onDecrease}
        disabled={decreaseDisabled}
        aria-label="Decrease quantity"
        className="flex h-full w-11 items-center justify-center text-neutral-500 transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
      >
        −
      </button>
    ) : null);

  const incControl =
    increaseForm ??
    (onIncrease ? (
      <button
        type={increaseType}
        onClick={onIncrease}
        disabled={increaseDisabled}
        aria-label="Increase quantity"
        className="flex h-full w-11 items-center justify-center text-neutral-500 transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
      >
        +
      </button>
    ) : null);

  return (
    <div className="flex h-12 shrink-0 items-stretch overflow-hidden rounded-sm border border-neutral-300 bg-white">
      {decControl}
      <span
        className="flex min-w-[2.75rem] items-center justify-center border-x border-neutral-200 text-sm font-medium tabular-nums text-black"
        aria-live="polite"
      >
        {quantity}
      </span>
      {incControl}
    </div>
  );
}

function ProductCartActionsInner({
  cart: originalCart,
  productHandle,
  selectedVariant,
  canAddToCart,
}: {
  cart: CartApiQueryFragment | null;
  productHandle: string;
  selectedVariant: SelectedVariant | null | undefined;
  canAddToCart: boolean;
}) {
  const cart = useOptimisticCart(originalCart);
  const lines = cart?.lines?.nodes ?? [];

  const selectedLine = selectedVariant?.id
    ? lines.find(
        (line) =>
          line.merchandise?.product?.handle === productHandle &&
          line.merchandise?.id === selectedVariant.id,
      )
    : undefined;

  const [addQuantity, setAddQuantity] = useState(1);
  const inBag = Boolean(selectedLine);
  const displayQty = selectedLine?.quantity ?? addQuantity;
  const variantLabel = formatVariantLabel(
    selectedVariant?.selectedOptions,
    selectedVariant?.title,
  );

  useEffect(() => {
    if (!inBag) setAddQuantity(1);
  }, [selectedVariant?.id, inBag]);

  if (!canAddToCart) {
    return (
      <div className="flex gap-3 opacity-60">
        <PremiumQuantityBox
          quantity={1}
          decreaseDisabled
          increaseDisabled
          onDecrease={() => undefined}
          onIncrease={() => undefined}
        />
        <button type="button" disabled className={addButtonClass}>
          Sold out
        </button>
      </div>
    );
  }

  const quantityBox = inBag && selectedLine ? (
    <PremiumQuantityBox
      quantity={displayQty}
      decreaseDisabled={displayQty <= 1 || Boolean(selectedLine.isOptimistic)}
      increaseDisabled={Boolean(selectedLine.isOptimistic)}
      decreaseForm={
        <CartLineUpdateForm
          lines={[
            {
              id: selectedLine.id,
              quantity: Math.max(0, displayQty - 1),
            },
          ]}
        >
          <button
            type="submit"
            aria-label="Decrease quantity"
            disabled={displayQty <= 1 || Boolean(selectedLine.isOptimistic)}
            className="flex h-full w-11 items-center justify-center text-neutral-500 transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            −
          </button>
        </CartLineUpdateForm>
      }
      increaseForm={
        <CartLineUpdateForm
          lines={[{id: selectedLine.id, quantity: displayQty + 1}]}
        >
          <button
            type="submit"
            aria-label="Increase quantity"
            disabled={Boolean(selectedLine.isOptimistic)}
            className="flex h-full w-11 items-center justify-center text-neutral-500 transition-colors hover:text-primary disabled:cursor-not-allowed disabled:opacity-30"
          >
            +
          </button>
        </CartLineUpdateForm>
      }
    />
  ) : (
    <PremiumQuantityBox
      quantity={displayQty}
      decreaseDisabled={displayQty <= 1}
      onDecrease={() => setAddQuantity((q) => Math.max(1, q - 1))}
      onIncrease={() => setAddQuantity((q) => q + 1)}
    />
  );

  const addButton =
    inBag ? (
      <button type="button" disabled className={addButtonClass}>
        In bag
      </button>
    ) : (
      <AddToCartButton
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: addQuantity,
                  selectedVariant,
                },
              ]
            : []
        }
        className={addButtonClass}
      >
        Add to bag
      </AddToCartButton>
    );

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-stretch gap-3">
        {quantityBox}
        {addButton}
      </div>
      {variantLabel ? (
        <p className="text-[11px] tracking-wide text-neutral-500">
          {inBag ? (
            <>
              <span className="text-neutral-800">{variantLabel}</span>
              {' · '}
              {displayQty} in bag
            </>
          ) : (
            variantLabel
          )}
        </p>
      ) : null}
    </div>
  );
}

function ProductCartActionsFallback({
  canAddToCart,
  selectedVariant,
}: {
  canAddToCart: boolean;
  selectedVariant: SelectedVariant | null | undefined;
}) {
  const [addQuantity, setAddQuantity] = useState(1);

  return (
    <div className="flex gap-3">
      <PremiumQuantityBox
        quantity={addQuantity}
        decreaseDisabled={addQuantity <= 1 || !canAddToCart}
        onDecrease={() => setAddQuantity((q) => Math.max(1, q - 1))}
        onIncrease={() => setAddQuantity((q) => q + 1)}
        increaseDisabled={!canAddToCart}
      />
      <AddToCartButton
        disabled={!canAddToCart}
        lines={
          selectedVariant
            ? [
                {
                  merchandiseId: selectedVariant.id,
                  quantity: addQuantity,
                  selectedVariant,
                },
              ]
            : []
        }
        className={addButtonClass}
      >
        {canAddToCart ? 'Add to bag' : 'Sold out'}
      </AddToCartButton>
    </div>
  );
}

export function ProductCartActions({
  productHandle,
  selectedVariant,
  canAddToCart,
}: {
  productTitle: string;
  productHandle: string;
  selectedVariant: SelectedVariant | null | undefined;
  canAddToCart: boolean;
}) {
  const rootData = useRouteLoaderData<RootLoader>('root');

  return (
    <Suspense
      fallback={
        <ProductCartActionsFallback
          canAddToCart={canAddToCart}
          selectedVariant={selectedVariant}
        />
      }
    >
      <Await resolve={rootData?.cart}>
        {(cart) => (
          <ProductCartActionsInner
            cart={cart}
            productHandle={productHandle}
            selectedVariant={selectedVariant}
            canAddToCart={canAddToCart}
          />
        )}
      </Await>
    </Suspense>
  );
}
