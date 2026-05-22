import {CartForm} from '@shopify/hydrogen';
import type {CartLineUpdateInput} from '@shopify/hydrogen/storefront-api-types';

export function getCartLineUpdateKey(lineIds: string[]) {
  return [CartForm.ACTIONS.LinesUpdate, ...lineIds].join('-');
}

export function CartLineUpdateForm({
  lines,
  children,
}: {
  lines: CartLineUpdateInput[];
  children: React.ReactNode;
}) {
  const lineIds = lines.map((line) => line.id);

  return (
    <CartForm
      fetcherKey={getCartLineUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesUpdate}
      inputs={{lines}}
    >
      {children}
    </CartForm>
  );
}

export function CartLineRemoveForm({
  lineIds,
  children,
  disabled,
}: {
  lineIds: string[];
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <CartForm
      fetcherKey={getCartLineUpdateKey(lineIds)}
      route="/cart"
      action={CartForm.ACTIONS.LinesRemove}
      inputs={{lineIds}}
    >
      {children}
    </CartForm>
  );
}
