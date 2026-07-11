import type {CartLayout} from '~/components/CartMain';
import {Link} from '~/components/Link';
import {Image, type OptimisticCartLine} from '@shopify/hydrogen';
import {
  CartLineRemoveForm,
  CartLineUpdateForm,
} from '~/components/cart/cartLineMutations';
import {useVariantUrl} from '~/lib/variants';

import {ProductPrice} from './ProductPrice';
import {useAside} from './Aside';
import type {CartApiQueryFragment} from 'storefrontapi.generated';

type CartLine = OptimisticCartLine<CartApiQueryFragment>;

/**
 * A single line item in the cart. It displays the product image, title, price.
 * It also provides controls to update the quantity or remove the line item.
 */
export function CartLineItem({
  layout,
  line,
}: {
  layout: CartLayout;
  line: CartLine;
}) {
  const {id, merchandise} = line;
  const {product, title, image, selectedOptions} = merchandise;
  const lineItemUrl = useVariantUrl(product.handle, selectedOptions);
  const {close} = useAside();

  return (
    <li key={id} className="cart-line">
      {image && (
        <Image
          alt={title}
          aspectRatio="1/1"
          data={image}
          height={100}
          loading="lazy"
          width={100}
        />
      )}

      <div>
        <Link
          prefetch="intent"
          to={lineItemUrl}
          onClick={() => {
            if (layout === 'aside') {
              close();
            }
          }}
        >
          <p>
            <strong>{product.title}</strong>
          </p>
        </Link>
        <ProductPrice price={line?.cost?.totalAmount} />
        <ul>
          {selectedOptions.map((option) => (
            <li key={option.name}>
              <small>
                {option.name}: {option.value}
              </small>
            </li>
          ))}
        </ul>
        <CartLineQuantity line={line} />
      </div>
    </li>
  );
}

/**
 * Provides the controls to update the quantity of a line item in the cart.
 * These controls are disabled when the line item is new, and the server
 * hasn't yet responded that it was successfully added to the cart.
 */
function CartLineQuantity({line}: {line: CartLine}) {
  if (!line || typeof line?.quantity === 'undefined') return null;
  const {id: lineId, quantity, isOptimistic} = line;
  const prevQuantity = Number(Math.max(0, quantity - 1).toFixed(0));
  const nextQuantity = Number((quantity + 1).toFixed(0));

  return (
    <div className="cart-line-quantity">
      <small>Quantity: {quantity} &nbsp;&nbsp;</small>
      <CartLineUpdateForm lines={[{id: lineId, quantity: prevQuantity}]}>
        <button
          type="submit"
          aria-label="Decrease quantity"
          disabled={quantity <= 1 || !!isOptimistic}
        >
          <span>&#8722; </span>
        </button>
      </CartLineUpdateForm>
      &nbsp;
      <CartLineUpdateForm lines={[{id: lineId, quantity: nextQuantity}]}>
        <button
          type="submit"
          aria-label="Increase quantity"
          disabled={!!isOptimistic}
        >
          <span>&#43;</span>
        </button>
      </CartLineUpdateForm>
      &nbsp;
      <CartLineRemoveForm lineIds={[lineId]} disabled={!!isOptimistic}>
        <button type="submit" disabled={!!isOptimistic}>
          Remove
        </button>
      </CartLineRemoveForm>
    </div>
  );
}

