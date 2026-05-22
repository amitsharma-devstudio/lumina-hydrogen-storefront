import {useNavigate} from 'react-router';
import {Money, type MappedProductOptions} from '@shopify/hydrogen';
import {isVariantPurchasable} from '~/lib/variantAvailability';

export function VariantPicker({
  options,
}: {
  options: MappedProductOptions[];
}) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col gap-6">
      {options.map((option) => {
        if (option.optionValues.length === 1) return null;

        const isSizeOption = option.name.toLowerCase() === 'size';

        return (
          <div key={option.name} className="flex flex-col gap-3">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
              {option.name}
            </span>

            <div className="flex flex-wrap gap-2.5">
              {option.optionValues.map((value) => {
                const {
                  name,
                  selected,
                  available,
                  exists,
                  variantUriQuery,
                  firstSelectableVariant,
                } = value;

                const isPurchasable =
                  isVariantPurchasable(firstSelectableVariant) ||
                  (available && exists);
                const isDisabled = !exists;

                return (
                  <button
                    key={name}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (!selected && variantUriQuery) {
                        void navigate(`?${variantUriQuery}`, {
                          replace: true,
                          preventScrollReset: true,
                        });
                      }
                    }}
                    className={`
                      relative flex items-center justify-center rounded-sm border px-4 py-3 text-sm transition-all duration-200
                      ${
                        selected
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 bg-white text-black hover:border-black'
                      }
                      ${!isPurchasable ? 'opacity-40' : ''}
                      ${isDisabled ? 'cursor-not-allowed' : 'cursor-pointer'}
                    `}
                    aria-pressed={selected}
                    aria-disabled={isDisabled}
                  >
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      <span className="font-medium">{name}</span>
                      {isSizeOption && firstSelectableVariant?.price ? (
                        <>
                          <span
                            className={`h-3 w-px ${selected ? 'bg-gray-600' : 'bg-gray-300'}`}
                          />
                          <Money
                            data={firstSelectableVariant.price}
                            withoutTrailingZeros
                            className="font-medium"
                          />
                        </>
                      ) : null}
                    </span>

                    {!isPurchasable && exists ? (
                      <span className="sr-only"> (unavailable)</span>
                    ) : null}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
