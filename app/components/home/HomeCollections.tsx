import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import {PRODUCT_GRID_CLASSNAME} from '~/components/home/productGridClasses';
import type {FeaturedCollectionFragment} from 'storefrontapi.generated';

type CollectionWithProducts = FeaturedCollectionFragment & {
  products?: {
    nodes?: Array<{
      featuredImage?: FeaturedCollectionFragment['image'];
      images?: {nodes?: FeaturedCollectionFragment['image'][]};
    }>;
  };
};

function getCollectionCoverImage(collection: CollectionWithProducts) {
  if (collection.image?.url) return collection.image;
  const product = collection.products?.nodes?.[0];
  return (
    product?.featuredImage ??
    product?.images?.nodes?.[0] ??
    null
  );
}

export function HomeCollections({
  collections,
}: {
  collections: CollectionWithProducts[];
}) {
  if (!collections.length) return null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-16">
          <div className="mb-2 text-xs uppercase tracking-[0.15em] text-neutral-500">
            COLLECTIONS
          </div>
          <h2 className="text-4xl font-light tracking-tight text-black md:text-5xl">
            Curated For Your Needs
          </h2>
        </header>

        <div className={PRODUCT_GRID_CLASSNAME}>
          {collections.map((collection) => {
            const image = getCollectionCoverImage(collection);
            const collectionUrl = `/collections/${collection.handle}`;

            return (
              <article
                key={collection.id}
                className="group/card flex h-full flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)] transition-shadow duration-300 hover:shadow-[0_8px_30px_rgba(0,0,0,0.07)]"
              >
                <Link
                  to={collectionUrl}
                  prefetch="intent"
                  className="relative block aspect-[4/5] max-h-[200px] w-full overflow-hidden bg-white sm:max-h-[220px]"
                  aria-label={collection.title}
                >
                  {image?.url ? (
                    <Image
                      data={image}
                      alt={image.altText || collection.title}
                      sizes="(min-width: 1280px) 20vw, (min-width: 768px) 25vw, 45vw"
                      className="h-full w-full object-contain p-4 transition-transform duration-500 ease-out group-hover/card:scale-[1.02] sm:p-5"
                    />
                  ) : (
                    <div className="flex h-full flex-col items-center justify-center gap-2 bg-neutral-50 p-6 text-center">
                      <span className="text-[10px] uppercase tracking-[0.2em] text-neutral-400">
                        Collection
                      </span>
                      <span className="line-clamp-2 text-sm font-light text-neutral-800">
                        {collection.title}
                      </span>
                    </div>
                  )}
                </Link>

                <div className="flex flex-1 flex-col px-3.5 pb-4 pt-3.5">
                  <Link
                    to={collectionUrl}
                    prefetch="intent"
                    className="flex flex-1 flex-col justify-between gap-2.5"
                  >
                    <h3 className="line-clamp-2 min-h-[2.75rem] text-[13px] font-medium leading-snug tracking-tight text-neutral-900 transition-colors group-hover/card:text-black sm:text-sm">
                      {collection.title}
                    </h3>
                    <div className="flex items-baseline justify-between gap-2 border-t border-neutral-100 pt-2.5">
                      <span className="text-[9px] font-medium uppercase tracking-[0.16em] text-neutral-400">
                        Explore
                      </span>
                      <span className="text-base font-light tracking-tight text-neutral-900">
                        →
                      </span>
                    </div>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
