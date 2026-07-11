import {
  createContext,
  type ReactNode,
  useContext,
  useEffect,
  useId,
  useRef,
  useState,
} from 'react';

type AsideType = 'search' | 'cart' | 'mobile' | 'closed';
type AsideContextValue = {
  type: AsideType;
  open: (mode: AsideType) => void;
  close: () => void;
};

/**
 * A side bar component with Overlay
 * @example
 * ```jsx
 * <Aside type="search" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 */
export function Aside({
  children,
  heading,
  type,
  asideClassName,
}: {
  children?: React.ReactNode;
  type: AsideType;
  heading: React.ReactNode;
  /** Extra class on the panel (e.g. search-modal). */
  asideClassName?: string;
}) {
  const {type: activeType, close} = useAside();
  const expanded = type === activeType;
  const titleId = useId();
  const panelRef = useRef<HTMLElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const overlay = overlayRef.current;
    if (!overlay) return;
    if (expanded) {
      overlay.removeAttribute('inert');
    } else {
      overlay.setAttribute('inert', '');
    }
  }, [expanded]);

  useEffect(() => {
    const abortController = new AbortController();

    if (expanded) {
      document.addEventListener(
        'keydown',
        function handler(event: KeyboardEvent) {
          if (event.key === 'Escape') {
            close();
          }
        },
        {signal: abortController.signal},
      );

      // Move focus into the panel when opened
      const focusable = panelRef.current?.querySelector<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
      );
      focusable?.focus();
    }
    return () => abortController.abort();
  }, [close, expanded]);

  const isSearchModal = asideClassName?.includes('search-modal');

  return (
    <div
      ref={overlayRef}
      aria-modal={expanded || undefined}
      aria-hidden={!expanded}
      className={`overlay ${expanded ? 'expanded' : ''}${
        isSearchModal ? ' overlay--search' : ''
      }`}
      role={expanded ? 'dialog' : undefined}
    >
      <button
        type="button"
        className="close-outside"
        onClick={close}
        aria-label="Close dialog"
        tabIndex={expanded ? 0 : -1}
      />
      <aside
        ref={panelRef}
        className={asideClassName}
        aria-labelledby={titleId}
      >
        <header>
          <h3 id={titleId}>{heading}</h3>
          <button
            type="button"
            className="close reset"
            onClick={close}
            aria-label="Close"
            tabIndex={expanded ? 0 : -1}
          >
            &times;
          </button>
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

const AsideContext = createContext<AsideContextValue | null>(null);

Aside.Provider = function AsideProvider({children}: {children: ReactNode}) {
  const [type, setType] = useState<AsideType>('closed');

  return (
    <AsideContext.Provider
      value={{
        type,
        open: setType,
        close: () => setType('closed'),
      }}
    >
      {children}
    </AsideContext.Provider>
  );
};

export function useAside() {
  const aside = useContext(AsideContext);
  if (!aside) {
    throw new Error('useAside must be used within an AsideProvider');
  }
  return aside;
}
