import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

type PageInfo = {
  hasPreviousPage?: boolean;
  hasNextPage?: boolean;
};

function LoadMoreSection<NodesType>({
  nodes,
  isLoading,
  hasNextPage,
  NextLink,
  renderItem,
  resourcesClassName,
  onLoadedCount,
}: {
  nodes: NodesType[];
  isLoading: boolean;
  hasNextPage: boolean;
  NextLink: React.ForwardRefExoticComponent<
    React.PropsWithChildren & React.RefAttributes<HTMLAnchorElement>
  >;
  renderItem: React.FunctionComponent<{node: NodesType; index: number}>;
  resourcesClassName?: string;
  onLoadedCount?: (count: number) => void;
}) {
  // Report the accumulated (loaded) node count so callers can show an
  // accurate total that grows as more pages load.
  React.useEffect(() => {
    onLoadedCount?.(nodes.length);
  }, [nodes.length, onLoadedCount]);

  const resourcesMarkup = nodes.map((node, index) => renderItem({node, index}));

  return (
    <div className="catalog-pagination">
      {resourcesClassName ? (
        <div className={resourcesClassName}>{resourcesMarkup}</div>
      ) : (
        resourcesMarkup
      )}

      {hasNextPage ? (
        <div className="mt-10 flex justify-center">
          <NextLink>
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
 * Paginated grid/list with a "Load more" button (Hydrogen cursor pagination).
 * Forward-only; reports the rendered count via `onLoadedCount`.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
  onLoadedCount,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'] & {
    pageInfo?: PageInfo;
  };
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  resourcesClassName?: string;
  onLoadedCount?: (count: number) => void;
}) {
  // Read hasNextPage from the loader connection (always present) rather than the
  // render prop, whose shape can vary across Hydrogen versions.
  const hasNextPage = connection?.pageInfo?.hasNextPage ?? false;

  return (
    <Pagination connection={connection}>
      {({nodes, isLoading, NextLink}) => (
        <LoadMoreSection<NodesType>
          nodes={nodes}
          isLoading={isLoading}
          hasNextPage={hasNextPage}
          NextLink={NextLink}
          renderItem={children}
          resourcesClassName={resourcesClassName}
          onLoadedCount={onLoadedCount}
        />
      )}
    </Pagination>
  );
}
