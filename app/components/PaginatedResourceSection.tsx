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
  maxAutoLoads: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}) {
  const nextRef = React.useRef<HTMLAnchorElement | null>(null);
  const [autoLoads, setAutoLoads] = React.useState(0);

  React.useEffect(() => {
    if (!autoLoadNext) return;
    if (autoLoads >= maxAutoLoads) return;
    if (isLoading) return;

    const el = nextRef.current;
    if (!el) return;

    const io = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (!first?.isIntersecting) return;
        setAutoLoads((n) => (n >= maxAutoLoads ? n : n + 1));
        el.click();
      },
      {rootMargin: '600px 0px'},
    );

    io.observe(el);
    return () => io.disconnect();
  }, [autoLoadNext, autoLoads, isLoading, maxAutoLoads]);

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
        <div className="mt-10 flex justify-center">
          <NextLink ref={nextRef}>
            <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-8 py-3 text-sm text-black transition-colors hover:border-neutral-400">
              {isLoading ? 'Loading…' : 'Load more'}
            </span>
          </NextLink>
        </div>
      ) : null}
    </div>
  );
}

/**
 * Paginated grid with Hydrogen cursor pagination.
 * Hides prev/next controls when not applicable (avoids empty link layout gaps).
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
    typeof autoLoadNext === 'object'
      ? autoLoadNext.maxAutoLoads ?? 2
      : 2;

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
