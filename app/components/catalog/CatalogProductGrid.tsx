import {useEffect} from 'react';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {CatalogProductCard} from '~/components/catalog/CatalogProductCard';
import {PRODUCT_GRID_CLASSNAME} from '~/components/home/productGridClasses';
import type {ProductCardProduct} from '~/components/product/productCard.types';

type ProductConnection = {
  nodes: ProductCardProduct[];
  pageInfo: {
    hasPreviousPage: boolean;
    hasNextPage: boolean;
    startCursor?: string | null;
    endCursor?: string | null;
  };
};

export function CatalogProductGrid({
  products,
  onLoadedCount,
}: {
  products: ProductConnection;
  /** Receives the number of products currently rendered (grows as pages load). */
  onLoadedCount?: (count: number) => void;
}) {
  const needsPagination =
    products.pageInfo.hasPreviousPage || products.pageInfo.hasNextPage;

  // The paginated branch reports its rendered count via PaginatedResourceSection.
  useEffect(() => {
    if (!needsPagination) onLoadedCount?.(products.nodes.length);
  }, [needsPagination, products.nodes.length, onLoadedCount]);

  if (!needsPagination) {
    return (
      <div className={PRODUCT_GRID_CLASSNAME}>
        {products.nodes.map((product) => (
          <CatalogProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <PaginatedResourceSection<ProductCardProduct>
      connection={products}
      resourcesClassName={PRODUCT_GRID_CLASSNAME}
      onLoadedCount={onLoadedCount}
    >
      {({node: product}) => (
        <CatalogProductCard key={product.id} product={product} />
      )}
    </PaginatedResourceSection>
  );
}
