import {Link} from 'react-router';
import {Image, Money} from '@shopify/hydrogen';
import type {RoutineProductCard} from '~/lib/skincare';

export function CompleteTheRoutine({
  regimen,
  currentHandle,
}: {
  regimen: {
    title: string;
    description?: string | null;
    products: RoutineProductCard[];
  };
  currentHandle: string;
}) {
  const items = regimen.products;
  if (!items.length) return null;

  return (
    <section
      id="complete-routine"
      className="mt-32 border-t border-gray-100 bg-[#FAFAFA] pt-24 scroll-mt-24"
    >
      <div className="mx-auto max-w-6xl px-4">
        <div className="mb-16 text-center">
          <h2 className="mb-4 font-serif text-3xl italic">{regimen.title}</h2>
          {regimen.description ? (
            <p className="mx-auto max-w-md text-sm leading-relaxed text-gray-500">
              {regimen.description}
            </p>
          ) : null}
        </div>

        <div className="relative grid grid-cols-1 gap-12 md:grid-cols-3 lg:gap-20">
          <div className="absolute top-[25%] -z-0 hidden h-px w-full bg-gray-200 md:block" />

          {items.map((item) => {
            const isCurrent = item.handle === currentHandle;

            return (
              <div
                key={item.id}
                className="relative z-10 flex flex-col items-center group"
              >
                <div
                  className={`mb-6 flex h-14 w-14 flex-col items-center justify-center rounded-full border transition-all ${
                    isCurrent
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-gray-200 bg-white text-foreground'
                  }`}
                >
                  <span className="text-[10px] font-bold">{item.step}</span>
                  <span className="text-[8px] uppercase tracking-tighter">
                    {item.category}
                  </span>
                </div>

                <div
                  className={`w-full rounded-sm p-4 transition-all duration-500 ${
                    isCurrent
                      ? 'scale-105 bg-white shadow-sm ring-1 ring-gray-100'
                      : 'opacity-80 grayscale-[0.5]'
                  }`}
                >
                  <div className="mb-6 aspect-[4/5] overflow-hidden bg-gray-50">
                    {item.featuredImage ? (
                      <Image
                        data={item.featuredImage}
                        className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-110"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center text-xs text-neutral-400">
                        No image
                      </div>
                    )}
                  </div>

                  <h3 className="h-8 text-center text-[10px] font-bold uppercase tracking-widest">
                    {item.title}
                  </h3>

                  {!isCurrent ? (
                    <div className="mt-4 flex flex-col items-center">
                      {item.priceRange?.minVariantPrice ? (
                        <Money
                          data={item.priceRange.minVariantPrice}
                          className="mb-4 text-xs text-gray-500"
                        />
                      ) : null}
                      <Link
                        to={`/products/${item.handle}`}
                        prefetch="intent"
                        className="border-b border-primary pb-1 text-[10px] font-bold uppercase hover:border-primary-hover hover:text-primary-hover"
                      >
                        Add step to bag +
                      </Link>
                    </div>
                  ) : (
                    <div className="mt-4 flex flex-col items-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                        Currently viewing
                      </span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
