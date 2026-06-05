import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

type PageInfo = {
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
};

function PaginatedResourceSectionInner<NodesType>({
  nodes,
  isLoading,
  PreviousLink,
  NextLink,
  renderItem,
  resourcesClassName,
  autoLoadNext,
  maxAutoLoads,
  hasPreviousPage,
  hasNextPage,
}: {
  nodes: NodesType[];
  isLoading: boolean;
  PreviousLink: React.ComponentType<React.PropsWithChildren>;
  NextLink: React.ForwardRefExoticComponent<
    React.PropsWithChildren & React.RefAttributes<HTMLAnchorElement>
  >;
  renderItem: React.FunctionComponent<{node: NodesType; index: number}>;
  resourcesClassName?: string;
  autoLoadNext: boolean;
  maxAutoLoads?: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}) {
  const nextRef = React.useRef<HTMLAnchorElement | null>(null);
  const [autoLoads, setAutoLoads] = React.useState(0);
  const capped =
    typeof maxAutoLoads === 'number' && Number.isFinite(maxAutoLoads);
  const autoLoadExhausted = capped && autoLoads >= (maxAutoLoads as number);

  React.useEffect(() => {
    if (!autoLoadNext) return;
    if (autoLoadExhausted) return;
    if (isLoading) return;
    if (!hasNextPage) return;

    const el = nextRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        setAutoLoads((n) => (capped && n >= (maxAutoLoads as number) ? n : n + 1));
        el.click();
      },
      {rootMargin: '480px 0px', threshold: 0},
    );

    io.observe(el);
    return () => io.disconnect();
  }, [
    autoLoadNext,
    autoLoadExhausted,
    isLoading,
    hasNextPage,
    capped,
    maxAutoLoads,
  ]);

  const resourcesMarkup = nodes.map((node, index) => renderItem({node, index}));

  return (
    <div className="catalog-pagination">
      {hasPreviousPage ? (
        <div className="mb-8 flex justify-center">
          <PreviousLink>
            {isLoading ? (
              <span className="text-sm text-neutral-500">Loading…</span>
            ) : (
              <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-6 py-2.5 text-sm text-neutral-800 transition-colors hover:border-neutral-400">
                Load previous
              </span>
            )}
          </PreviousLink>
        </div>
      ) : null}

      {resourcesClassName ? (
        <div className={resourcesClassName}>{resourcesMarkup}</div>
      ) : (
        resourcesMarkup
      )}

      {hasNextPage ? (
        autoLoadNext ? (
          <div className="catalog-pagination-scroll-footer">
            {isLoading ? (
              <p
                className="catalog-pagination-loading"
                role="status"
                aria-live="polite"
              >
                Loading more products…
              </p>
            ) : autoLoadExhausted ? (
              <div className="mt-8 flex justify-center">
                <NextLink>
                  <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-8 py-3 text-sm text-neutral-800 transition-colors hover:border-primary">
                    Load more
                  </span>
                </NextLink>
              </div>
            ) : null}
            <NextLink
              ref={nextRef}
              className="catalog-pagination-sentinel"
              tabIndex={-1}
              aria-hidden={!autoLoadExhausted}
            >
              <span className="sr-only">Load more products</span>
            </NextLink>
          </div>
        ) : (
          <div className="mt-10 flex justify-center">
            <NextLink ref={nextRef}>
              <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-8 py-3 text-sm text-black transition-colors hover:border-neutral-400">
                {isLoading ? 'Loading…' : 'Load more'}
              </span>
            </NextLink>
          </div>
        )
      ) : null}
    </div>
  );
}

/**
 * Paginated grid with Hydrogen cursor pagination.
 * Pass `autoLoadNext` for infinite scroll (optional `maxAutoLoads` cap).
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
  autoLoadNext = false,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'] & {
    pageInfo?: PageInfo;
  };
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  resourcesClassName?: string;
  autoLoadNext?: boolean | {maxAutoLoads?: number};
}) {
  const maxAutoLoads =
    typeof autoLoadNext === 'object' ? autoLoadNext.maxAutoLoads : undefined;

  const hasPreviousPage = connection?.pageInfo?.hasPreviousPage ?? false;
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, PreviousLink, NextLink}) => (
        <PaginatedResourceSectionInner<NodesType>
          nodes={nodes}
          isLoading={isLoading}
          PreviousLink={PreviousLink}
          NextLink={NextLink}
          renderItem={children}
          resourcesClassName={resourcesClassName}
          autoLoadNext={!!autoLoadNext}
          maxAutoLoads={maxAutoLoads}
          hasPreviousPage={hasPreviousPage}
          hasNextPage={hasNextPage}
        />
      )}
    </Pagination>
  );
}
