import {
  cloneElement,
  isValidElement,
  useId,
  useRef,
  useState,
  type ReactElement,
  type ReactNode,
} from 'react';

type TooltipSide = 'top' | 'bottom';

type TooltipProps = {
  content: string;
  children: ReactNode;
  side?: TooltipSide;
  /** Delay before showing on hover/focus (ms). Kept short for responsive feel. */
  showDelayMs?: number;
};

const sideClasses: Record<TooltipSide, string> = {
  top: 'bottom-full left-1/2 mb-2 -translate-x-1/2',
  bottom: 'top-full left-1/2 mt-2 -translate-x-1/2',
};

export function Tooltip({
  content,
  children,
  side = 'top',
  showDelayMs = 120,
}: TooltipProps) {
  const tooltipId = useId();
  const showTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [open, setOpen] = useState(false);

  const clearShowTimer = () => {
    if (showTimerRef.current) {
      clearTimeout(showTimerRef.current);
      showTimerRef.current = null;
    }
  };

  const show = () => {
    clearShowTimer();
    showTimerRef.current = setTimeout(() => setOpen(true), showDelayMs);
  };

  const hide = () => {
    clearShowTimer();
    setOpen(false);
  };

  const trigger =
    isValidElement(children) && children.type !== 'string'
      ? cloneElement(children as ReactElement<{className?: string}>, {
          className: [
            (children as ReactElement<{className?: string}>).props.className,
            'inline-flex',
          ]
            .filter(Boolean)
            .join(' '),
        })
      : children;

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={show}
      onMouseLeave={hide}
      onFocus={show}
      onBlur={hide}
    >
      <span aria-describedby={open ? tooltipId : undefined}>{trigger}</span>
      {open ? (
        <span
          id={tooltipId}
          role="tooltip"
          onMouseEnter={show}
          onMouseLeave={hide}
          className={`pointer-events-auto absolute z-50 w-max max-w-[14rem] rounded-md bg-neutral-900 px-2.5 py-1.5 text-center text-[11px] leading-snug text-white shadow-md ${sideClasses[side]}`}
        >
          {content}
        </span>
      ) : null}
    </span>
  );
}
