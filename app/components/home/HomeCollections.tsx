import {Link} from 'react-router';
import {Image} from '@shopify/hydrogen';
import type {FeaturedCollectionFragment} from 'storefrontapi.generated';

export function HomeCollections({
  collections,
}: {
  collections: FeaturedCollectionFragment[];
}) {
  if (!collections.length) return null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-12">
          <div className="mb-2 text-xs uppercase tracking-[0.15em] text-neutral-500">
            COLLECTIONS
          </div>
          <h2 className="text-4xl font-light tracking-tight text-black md:text-5xl">
            Curated For Your Needs
          </h2>
        </header>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {collections.map((collection) => {
            const image = collection.image;
            return (
              <Link
                key={collection.id}
                to={`/collections/${collection.handle}`}
                prefetch="intent"
                className="group"
              >
                <div className="relative mb-4 overflow-hidden rounded-2xl bg-neutral-50">
                  <div className="aspect-[3/4]">
                    {image ? (
                      <Image
                        data={image}
                        alt={image.altText || collection.title}
                        sizes="(min-width: 64em) 240px, 50vw"
                        className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                      />
                    ) : (
                      <div className="h-full w-full" />
                    )}
                  </div>
                </div>

                <div className="text-xs uppercase tracking-[0.12em] text-neutral-500">
                  Collection
                </div>
                <div className="mt-1 text-lg font-normal text-black">
                  {collection.title}
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

