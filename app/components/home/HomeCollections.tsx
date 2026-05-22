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
        <header className="mb-16">
          <div className="mb-2 text-xs uppercase tracking-[0.15em] text-neutral-500">
            COLLECTIONS
          </div>
          <h2 className="text-4xl font-light tracking-tight text-black md:text-5xl">
            Curated For Your Needs
          </h2>
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
