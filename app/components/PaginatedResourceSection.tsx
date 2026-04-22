import * as React from 'react';
import {Pagination} from '@shopify/hydrogen';

function PaginatedResourceSectionInner<NodesType>({
  nodes,
  isLoading,
  PreviousLink,
  NextLink,
  renderItem,
  resourcesClassName,
  autoLoadNext,
  maxAutoLoads,
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
    <div>
      <PreviousLink>
        {isLoading ? 'Loading...' : <span>↑ Load previous</span>}
      </PreviousLink>
      {resourcesClassName ? (
        <div className={resourcesClassName}>{resourcesMarkup}</div>
      ) : (
        resourcesMarkup
      )}
      <div className="mt-10 flex justify-center">
        <NextLink ref={nextRef}>
          <span className="inline-flex items-center rounded-full border border-neutral-200 bg-white px-8 py-3 text-sm text-black transition-colors hover:border-neutral-400">
            {isLoading ? 'Loading…' : 'Load more'}
          </span>
        </NextLink>
      </div>
    </div>
  );
}

/**
 * <PaginatedResourceSection > is a component that encapsulate how the previous and next behaviors throughout your application.
 */
export function PaginatedResourceSection<NodesType>({
  connection,
  children,
  resourcesClassName,
  autoLoadNext = false,
}: {
  connection: React.ComponentProps<typeof Pagination<NodesType>>['connection'];
  children: React.FunctionComponent<{node: NodesType; index: number}>;
  resourcesClassName?: string;
  /**
   * Auto-load the next page when the pagination control enters the viewport.
   * Keeps cursor URLs intact (SEO/back-forward), but limits auto loads to avoid trapping users above the footer.
   */
  autoLoadNext?: boolean | {maxAutoLoads?: number};
}) {
  const maxAutoLoads =
    typeof autoLoadNext === 'object'
      ? autoLoadNext.maxAutoLoads ?? 2
      : 2;

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
        />
      )}
    </Pagination>
  );
}
