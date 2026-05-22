import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {ProductCard} from '~/components/product/ProductCard';
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
  autoLoadNext,
}: {
  products: ProductConnection;
  autoLoadNext?: boolean | {maxAutoLoads?: number};
}) {
  const needsPagination =
    products.pageInfo.hasPreviousPage || products.pageInfo.hasNextPage;

  if (!needsPagination) {
    return (
      <div className={PRODUCT_GRID_CLASSNAME}>
        {products.nodes.map((product) => (
          <ProductCard key={product.id} product={product} />
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
      {({node: product}) => <ProductCard key={product.id} product={product} />}
    </PaginatedResourceSection>
  );
}
