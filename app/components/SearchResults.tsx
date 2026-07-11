
import {Link} from '~/components/Link';
import {CatalogProductCard} from '~/components/catalog/CatalogProductCard';
import {PaginatedResourceSection} from '~/components/PaginatedResourceSection';
import {PRODUCT_GRID_CLASSNAME} from '~/components/home/productGridClasses';
import {SearchSectionHeader} from '~/components/search/SearchSectionHeader';
import {mapSearchProductToCard} from '~/lib/mapSearchProductToCard';
import {urlWithTrackingParams, type RegularSearchReturn} from '~/lib/search';

type SearchItems = RegularSearchReturn['result']['items'];
type PartialSearchResult<ItemType extends keyof SearchItems> = Pick<
  SearchItems,
  ItemType
> &
  Pick<RegularSearchReturn, 'term'>;

type SearchResultsProps = RegularSearchReturn & {
  children: (args: SearchItems & {term: string}) => React.ReactNode;
};

export function SearchResults({
  term,
  result,
  children,
}: Omit<SearchResultsProps, 'error' | 'type'>) {
  if (!result?.total) {
    return null;
  }

  return children({...result.items, term});
}

SearchResults.Articles = SearchResultsArticles;
SearchResults.Pages = SearchResultsPages;
SearchResults.Products = SearchResultsProducts;
SearchResults.Empty = SearchResultsEmpty;

function SearchLinkList({
  eyebrow,
  title,
  items,
}: {
  eyebrow: string;
  title: string;
  items: Array<{id: string; label: string; to: string}>;
}) {
  if (!items.length) return null;

  return (
    <section>
      <SearchSectionHeader eyebrow={eyebrow} title={title} />
      <ul className="overflow-hidden rounded-2xl border border-neutral-200/90 bg-white shadow-[0_1px_0_rgba(0,0,0,0.04)]">
        {items.map((item, index) => (
          <li
            key={item.id}
            className={
              index > 0 ? 'border-t border-neutral-100' : undefined
            }
          >
            <Link
              prefetch="intent"
              to={item.to}
              className="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-neutral-50/80"
            >
              <span className="text-sm font-medium text-neutral-800 transition-colors group-hover:text-black">
                {item.label}
              </span>
              <span
                className="text-neutral-300 transition-transform group-hover:translate-x-0.5 group-hover:text-primary"
                aria-hidden
              >
                →
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

function SearchResultsArticles({
  term,
  articles,
}: PartialSearchResult<'articles'>) {
  if (!articles?.nodes.length) return null;

  const items = articles.nodes.map((article) => ({
    id: article.id,
    label: article.title,
    to: urlWithTrackingParams({
      baseUrl: `/blogs/${article.handle}`,
      trackingParams: article.trackingParameters,
      term,
    }),
  }));

  return (
    <SearchLinkList eyebrow="Journal" title="Articles" items={items} />
  );
}

function SearchResultsPages({term, pages}: PartialSearchResult<'pages'>) {
  if (!pages?.nodes.length) return null;

  const items = pages.nodes.map((page) => ({
    id: page.id,
    label: page.title,
    to: urlWithTrackingParams({
      baseUrl: `/pages/${page.handle}`,
      trackingParams: page.trackingParameters,
      term,
    }),
  }));

  return <SearchLinkList eyebrow="Pages" title="Store pages" items={items} />;
}

function SearchResultsProducts({
  term,
  products,
}: PartialSearchResult<'products'>) {
  if (!products?.nodes.length) return null;

  const count = products.nodes.length;
  const needsPagination =
    products.pageInfo?.hasPreviousPage || products.pageInfo?.hasNextPage;

  const renderCard = (product: (typeof products.nodes)[number]) => {
    const productUrl = urlWithTrackingParams({
      baseUrl: `/products/${product.handle}`,
      trackingParams: product.trackingParameters,
      term,
    });

    return (
      <CatalogProductCard
        key={product.id}
        product={mapSearchProductToCard(product)}
        productUrl={productUrl}
      />
    );
  };

  return (
    <section>
      <SearchSectionHeader
        eyebrow="Products"
        title="Matching products"
        description={
          count > 0
            ? `Showing ${count} product${count === 1 ? '' : 's'} on this page.`
            : undefined
        }
      />
      {needsPagination ? (
        <PaginatedResourceSection
          connection={products}
          resourcesClassName={PRODUCT_GRID_CLASSNAME}
        >
          {({node: product}) => renderCard(product)}
        </PaginatedResourceSection>
      ) : (
        <div className={PRODUCT_GRID_CLASSNAME}>
          {products.nodes.map((product) => renderCard(product))}
        </div>
      )}
    </section>
  );
}

function SearchResultsEmpty() {
  return null;
}
