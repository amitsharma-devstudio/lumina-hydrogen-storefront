import {PRODUCT_GRID_CLASSNAME} from '~/components/home/productGridClasses';

type SkeletonProps = {
  className?: string;
};

/** Base pulse block for loading placeholders. */
export function Skeleton({className = ''}: SkeletonProps) {
  return (
    <div
      className={`animate-pulse rounded-lg bg-neutral-100 ${className}`}
      aria-hidden
    />
  );
}

export function ProductCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-neutral-200/90 bg-white">
      <Skeleton className="aspect-[4/5] w-full rounded-none" />
      <div className="space-y-3 px-3.5 py-4">
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-4 w-[80%]" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function ProductGridSkeleton({count = 8}: {count?: number}) {
  return (
    <div
      className={PRODUCT_GRID_CLASSNAME}
      role="status"
      aria-label="Loading products"
    >
      {Array.from({length: count}, (_, index) => (
        <ProductCardSkeleton key={index} />
      ))}
      <span className="sr-only">Loading products…</span>
    </div>
  );
}

export function CartAsideSkeleton() {
  return (
    <div className="space-y-4 p-1" role="status" aria-label="Loading cart">
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="h-20 w-full rounded-xl" />
      <Skeleton className="mt-6 h-10 w-full rounded-full" />
      <span className="sr-only">Loading cart…</span>
    </div>
  );
}

export function FooterSkeleton() {
  return (
    <div
      className="mx-auto grid max-w-7xl gap-8 px-6 py-12 sm:grid-cols-2 lg:grid-cols-4"
      role="status"
      aria-label="Loading footer"
    >
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <Skeleton className="h-24 w-full" />
      <span className="sr-only">Loading footer…</span>
    </div>
  );
}
