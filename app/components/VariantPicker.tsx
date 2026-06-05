import {useNavigate} from 'react-router';
import {Money, type MappedProductOptions} from '@shopify/hydrogen';
import {isOptionValuePurchasable} from '~/lib/variantAvailability';
import {chipHoverClass, chipSelectedClass} from '~/lib/theme';

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

                const isDisabled = !isOptionValuePurchasable({
                  exists,
                  available,
                  firstSelectableVariant,
                });

                return (
                  <button
                    key={name}
                    type="button"
                    disabled={isDisabled}
                    onClick={() => {
                      if (isDisabled || selected || !variantUriQuery) return;
                      void navigate(`?${variantUriQuery}`, {
                        replace: true,
                        preventScrollReset: true,
                      });
                    }}
                    className={`
                      relative flex items-center justify-center rounded-sm border px-4 py-3 text-sm transition-all duration-200
                      ${
                        selected
                          ? chipSelectedClass
                          : `border-gray-200 bg-white text-foreground ${chipHoverClass}`
                      }
                      ${isDisabled ? 'cursor-not-allowed opacity-50 text-gray-400' : 'cursor-pointer'}
                    `}
                    aria-pressed={selected}
                    aria-disabled={isDisabled}
                  >
                    <span
                      className={`flex items-center gap-2 whitespace-nowrap ${isDisabled ? 'line-through decoration-gray-400' : ''}`}
                    >
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

                    {isDisabled ? (
                      <span className="sr-only"> (not available)</span>
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
