import type {KeyboardEvent, ReactNode} from 'react';
import {useCarousel} from '~/components/ui/useCarousel';

type HomeSectionCarouselProps<T> = {
  items: T[];
  getKey: (item: T, index: number) => string;
  renderItem: (item: T, index: number) => ReactNode;
  /** Desktop layout classes (e.g. product grid). Hidden below md. Ignored when mobileOnly. */
  desktopClassName?: string;
  ariaLabel: string;
  /** Optional auto-advance on mobile. Off by default for product carousels. */
  autoAdvance?: boolean;
  intervalMs?: number;
  /** Only render the mobile carousel (parent owns desktop layout). */
  mobileOnly?: boolean;
};

/**
 * Mobile: one-at-a-time carousel with dots under the slide.
 * Desktop (md+): normal multi-column grid of all items.
 */
export function HomeSectionCarousel<T>({
  items,
  getKey,
  renderItem,
  desktopClassName = 'grid-cols-1',
  ariaLabel,
  autoAdvance = false,
  intervalMs = 7000,
  mobileOnly = false,
}: HomeSectionCarouselProps<T>) {
  const count = items.length;
  const {activeIndex, goTo, next, prev, setPaused, canLoop} = useCarousel(
    count,
    {autoAdvance, intervalMs},
  );

  if (!count) return null;

  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (!canLoop) return;
    if (event.key === 'ArrowLeft') {
      event.preventDefault();
      prev();
    } else if (event.key === 'ArrowRight') {
      event.preventDefault();
      next();
    }
  }

  return (
    <>
      <div
        className={mobileOnly ? undefined : 'md:hidden'}
        role="region"
        aria-roledescription="carousel"
        aria-label={ariaLabel}
        tabIndex={canLoop ? 0 : undefined}
        onKeyDown={onKeyDown}
        onTouchStart={() => setPaused(true)}
        onTouchEnd={() => setPaused(false)}
      >
        <div className="relative">
          {items.map((item, index) => {
            const isActive = index === activeIndex;
            return (
              <div
                key={getKey(item, index)}
                className={isActive ? 'block' : 'hidden'}
                aria-hidden={!isActive}
                aria-roledescription="slide"
                aria-label={`${index + 1} of ${count}`}
              >
                {renderItem(item, index)}
              </div>
            );
          })}
        </div>

        {canLoop ? (
          <div
            className="mt-5 flex items-center justify-center gap-2"
            role="tablist"
            aria-label={`${ariaLabel} slides`}
          >
            {items.map((item, index) => (
              <button
                key={getKey(item, index)}
                type="button"
                role="tab"
                className={`h-2 rounded-full transition-all ${
                  index === activeIndex
                    ? 'w-7 bg-primary'
                    : 'w-2 bg-neutral-300 hover:bg-neutral-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
                aria-selected={index === activeIndex}
                onClick={() => goTo(index)}
              />
            ))}
          </div>
        ) : null}
      </div>

      {mobileOnly ? null : (
        <div className={`hidden md:grid ${desktopClassName}`}>
          {items.map((item, index) => (
            <div key={getKey(item, index)}>{renderItem(item, index)}</div>
          ))}
        </div>
      )}
    </>
  );
}
