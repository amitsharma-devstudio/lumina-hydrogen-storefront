import type { ReactNode } from 'react';

export function Badge({children}: {children: ReactNode}) {
  return (
    <span className="inline-block rounded-full bg-primary px-4 py-1 text-sm font-semibold tracking-wide text-primary-foreground">
      {children}
    </span>
  );
}