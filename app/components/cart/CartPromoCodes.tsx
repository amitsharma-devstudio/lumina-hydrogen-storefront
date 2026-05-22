import {useEffect, useRef} from 'react';
import {useFetcher} from 'react-router';
import {CartForm, Money} from '@shopify/hydrogen';
import type {CartApiQueryFragment} from 'storefrontapi.generated';
import {Button} from '~/components/ui/Button';
import {FormField} from '~/components/ui/FormField';
import {Input} from '~/components/ui/Input';
import {InputGroup} from '~/components/ui/InputGroup';

function UpdateDiscountForm({
  discountCodes,
  children,
}: {
  discountCodes?: string[];
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.DiscountCodesUpdate}
      inputs={{discountCodes: discountCodes ?? []}}
    >
      {children}
    </CartForm>
  );
}

export function CartDiscountSection({
  discountCodes,
}: {
  discountCodes?: CartApiQueryFragment['discountCodes'];
}) {
  const applicable =
    discountCodes?.filter((discount) => discount.applicable) ?? [];
  const inapplicable =
    discountCodes?.filter((discount) => !discount.applicable) ?? [];
  const applicableCodes = applicable
    .map(({code}) => code)
    .filter(Boolean) as string[];

  return (
    <FormField label="Discount code" htmlFor="cart-discount-code">
      {applicable.length > 0 ? (
        <ul className="mb-3 space-y-2">
          {applicable.map(({code}) => (
            <li
              key={code}
              className="flex items-center justify-between gap-2 rounded-sm bg-primary-muted px-3 py-2 text-sm"
            >
              <code className="font-medium text-primary">{code}</code>
              <UpdateDiscountForm
                discountCodes={applicableCodes.filter((c) => c !== code)}
              >
                <Button type="submit" variant="link" className="text-xs">
                  Remove
                </Button>
              </UpdateDiscountForm>
            </li>
          ))}
        </ul>
      ) : null}

      {inapplicable.length > 0 ? (
        <ul className="mb-3 space-y-2">
          {inapplicable.map(({code}) => (
            <li
              key={code}
              className="rounded-sm border border-neutral-200 px-3 py-2 text-sm text-neutral-500"
            >
              <code>{code}</code>
              <span className="ml-2 text-xs">— not applicable to this cart</span>
            </li>
          ))}
        </ul>
      ) : null}

      <UpdateDiscountForm discountCodes={applicableCodes}>
        <InputGroup>
          <Input
            id="cart-discount-code"
            type="text"
            name="discountCode"
            placeholder="Enter code"
            className="flex-1"
          />
          <Button type="submit" variant="apply">
            Apply
          </Button>
        </InputGroup>
      </UpdateDiscountForm>
    </FormField>
  );
}

function UpdateGiftCardForm({
  giftCardCodes,
  fetcherKey,
  children,
}: {
  giftCardCodes?: string[];
  fetcherKey?: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      fetcherKey={fetcherKey}
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesUpdate}
      inputs={{giftCardCodes: giftCardCodes ?? []}}
    >
      {children}
    </CartForm>
  );
}

function RemoveGiftCardForm({
  giftCardId,
  children,
}: {
  giftCardId: string;
  children: React.ReactNode;
}) {
  return (
    <CartForm
      route="/cart"
      action={CartForm.ACTIONS.GiftCardCodesRemove}
      inputs={{giftCardCodes: [giftCardId]}}
    >
      {children}
    </CartForm>
  );
}

function GiftCardApplyFields({
  giftCardCodes,
}: {
  giftCardCodes: string[];
}) {
  const giftCardCodeInput = useRef<HTMLInputElement>(null);
  const giftCardAddFetcher = useFetcher({key: 'gift-card-add'});
  const appliedGiftCardCodes = useRef(giftCardCodes);

  useEffect(() => {
    appliedGiftCardCodes.current = giftCardCodes;
  }, [giftCardCodes]);

  useEffect(() => {
    const code = giftCardAddFetcher.formData?.get('giftCardCode');
    if (!code) return;
    const formatted = String(code).replace(/\s/g, '');
    if (!appliedGiftCardCodes.current.includes(formatted)) {
      appliedGiftCardCodes.current.push(formatted);
    }
  }, [giftCardAddFetcher.formData]);

  useEffect(() => {
    if (giftCardAddFetcher.data && giftCardCodeInput.current) {
      giftCardCodeInput.current.value = '';
    }
  }, [giftCardAddFetcher.data]);

  return (
    <InputGroup>
      <Input
        ref={giftCardCodeInput}
        id="cart-gift-card"
        type="text"
        name="giftCardCode"
        placeholder="Enter gift card"
        className="flex-1"
      />
      <Button
        type="submit"
        variant="apply"
        disabled={giftCardAddFetcher.state !== 'idle'}
      >
        Apply
      </Button>
    </InputGroup>
  );
}

export function CartGiftCardSection({
  giftCards,
}: {
  giftCards?: CartApiQueryFragment['appliedGiftCards'];
}) {
  const persistedCodes = useRef<string[]>([]);

  return (
    <FormField label="Gift card" htmlFor="cart-gift-card">
      {giftCards && giftCards.length > 0 ? (
        <ul className="mb-3 space-y-2">
          {giftCards.map((giftCard) => (
            <li
              key={giftCard.id}
              className="flex items-center justify-between gap-2 rounded-sm bg-primary-muted px-3 py-2 text-sm"
            >
              <span className="text-neutral-800">
                <code className="font-medium text-primary">
                  ***{giftCard.lastCharacters}
                </code>
                <span className="ml-2 tabular-nums text-neutral-600">
                  <Money data={giftCard.amountUsed} />
                </span>
              </span>
              <RemoveGiftCardForm giftCardId={giftCard.id}>
                <Button type="submit" variant="link" className="text-xs">
                  Remove
                </Button>
              </RemoveGiftCardForm>
            </li>
          ))}
        </ul>
      ) : null}

      <UpdateGiftCardForm
        giftCardCodes={persistedCodes.current}
        fetcherKey="gift-card-add"
      >
        <GiftCardApplyFields giftCardCodes={persistedCodes.current} />
      </UpdateGiftCardForm>
    </FormField>
  );
}
