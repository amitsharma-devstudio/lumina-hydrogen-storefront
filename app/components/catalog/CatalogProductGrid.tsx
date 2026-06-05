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
  autoLoadNext = true,
}: {
  products: ProductConnection;
  /** Infinite scroll when more pages exist (default on). Pass `false` for button-only. */
  autoLoadNext?: boolean | {maxAutoLoads?: number};
}) {
  const needsPagination =
    products.pageInfo.hasPreviousPage || products.pageInfo.hasNextPage;

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
      autoLoadNext={autoLoadNext}
    >
      {({node: product}) => (
        <CatalogProductCard key={product.id} product={product} />
      )}
    </PaginatedResourceSection>
  );
}
