import {CollectionCard} from '~/components/collection/CollectionCard';
import {PRODUCT_GRID_CLASSNAME} from '~/components/home/productGridClasses';
import type {CollectionCardCollection} from '~/lib/collectionCoverImage';

export function HomeCollections({
  collections,
}: {
  collections: CollectionCardCollection[];
}) {
  if (!collections.length) return null;

  return (
    <section className="bg-white py-20">
      <div className="mx-auto max-w-7xl px-6">
        <header className="mb-14 grid gap-6 md:grid-cols-[1fr_0.75fr] md:items-end">
          <div>
            <div className="mb-2 text-xs uppercase tracking-[0.15em] text-primary">
              COLLECTIONS
            </div>
            <h2 className="max-w-2xl text-4xl font-light text-black md:text-5xl">
              Shop by what your skin is asking for
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-neutral-600 md:justify-self-end">
            Move quickly from concern to routine with edited collections built
            around hydration, clarity, renewal, and barrier care.
          </p>
        </header>

        <div className={PRODUCT_GRID_CLASSNAME}>
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </div>
      </div>
    </section>
  );
}
