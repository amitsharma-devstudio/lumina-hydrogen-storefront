import {Link} from 'react-router';
import {Money} from '@shopify/hydrogen';

export function VariantPicker({options}: {options: any[]}) {
  return (
    <div className="flex flex-col gap-8">
      {options.map((option) => {
        const isSizeOption = option.name.toLowerCase() === 'size';

        return (
          <div key={option.name} className="flex flex-col gap-4">
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">
              {option.name}
            </span>

            <div className="flex flex-wrap gap-3">
              {option.optionValues.map((value: any) => {
                const {name, isActive, to, isAvailable, firstSelectableVariant} = value;

                return (
                  <Link
                    key={name}
                    to={to}
                    preventScrollReset
                    prefetch="intent"
                    className={`
                      relative flex items-center justify-center rounded-sm border px-4 py-3 text-sm transition-all duration-300
                      ${isActive
                          ? 'border-black bg-black text-white'
                          : 'border-gray-200 bg-white text-black hover:border-black'
                      }
                      ${!isAvailable ? 'opacity-30 cursor-not-allowed' : ''}
                    `}
                  >
                    <span className="flex items-center gap-2 whitespace-nowrap">
                      {/* Variant Name (e.g. 30ml) */}
                      <span className="font-medium">{name}</span>

                      {/* Single-line Price (only for Size) */}
                      {isSizeOption && firstSelectableVariant?.price && (
                        <>
                          <span className={`h-3 w-[1px] ${isActive ? 'bg-gray-600' : 'bg-gray-300'}`} />
                          <Money 
                            data={firstSelectableVariant.price} 
                            withoutTrailingZeros 
                            className="font-medium"
                          />
                        </>
                      )}
                    </span>

                    {!isAvailable && (
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        <div className="w-full h-[1px] bg-gray-400 -rotate-6" />
                      </div>
                    )}
                  </Link>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}