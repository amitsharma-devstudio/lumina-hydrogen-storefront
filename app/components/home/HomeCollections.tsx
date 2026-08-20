import {Suspense} from 'react';
import {Await} from 'react-router';
import {CollectionCard} from '~/components/collection/CollectionCard';
import {HomeSectionCarousel} from '~/components/home/HomeSectionCarousel';
import {
  HOME_SECTION_HEADER,
  HOME_SECTION_EYEBROW,
  HOME_SECTION_LEDE,
  HOME_SECTION_SURFACE,
  HOME_SECTION_TITLE,
} from '~/components/home/homeSectionStyles';
import {PRODUCT_GRID_CLASSNAME} from '~/components/home/productGridClasses';
import {ProductGridSkeleton} from '~/components/ui/Skeleton';
import type {CollectionCardCollection} from '~/lib/collectionCoverImage';

function HomeCollectionsResolved({
  collections,
}: {
  collections: CollectionCardCollection[];
}) {
  if (!collections.length) return null;

  return (
    <section className={HOME_SECTION_SURFACE}>
      <div className="mx-auto max-w-7xl px-6">
        <header className={HOME_SECTION_HEADER}>
          <div>
            <p className={HOME_SECTION_EYEBROW}>Collections</p>
            <h2 className={HOME_SECTION_TITLE}>
              Shop by what your skin is asking for
            </h2>
          </div>
          <p className={HOME_SECTION_LEDE}>
            Move quickly from concern to routine with edited collections built
            around hydration, clarity, renewal, and barrier care.
          </p>
        </header>

        <HomeSectionCarousel
          items={collections}
          getKey={(collection) => collection.id}
          ariaLabel="Shop collections"
          desktopClassName={PRODUCT_GRID_CLASSNAME}
          renderItem={(collection, index) => (
            <CollectionCard
              collection={collection}
              loading={index === 0 ? 'eager' : 'lazy'}
            />
          )}
        />
      </div>
    </section>
  );
}

function HomeCollectionsSkeleton() {
  return (
    <section className={HOME_SECTION_SURFACE} aria-busy="true">
      <div className="mx-auto max-w-7xl px-6">
        <header className={HOME_SECTION_HEADER}>
          <div>
            <p className={HOME_SECTION_EYEBROW}>Collections</p>
            <h2 className={HOME_SECTION_TITLE}>
              Shop by what your skin is asking for
            </h2>
          </div>
          <p className={HOME_SECTION_LEDE}>
            Move quickly from concern to routine with edited collections built
            around hydration, clarity, renewal, and barrier care.
          </p>
        </header>
        <ProductGridSkeleton count={4} />
      </div>
    </section>
  );
}

export function HomeCollections({
  collections,
}: {
  collections: Promise<CollectionCardCollection[]>;
}) {
  return (
    <Suspense fallback={<HomeCollectionsSkeleton />}>
      <Await resolve={collections}>
        {(resolved) => <HomeCollectionsResolved collections={resolved} />}
      </Await>
    </Suspense>
  );
}
