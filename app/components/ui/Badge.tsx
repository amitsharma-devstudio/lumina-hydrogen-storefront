import type { ReactNode } from 'react';

export function Badge({children}: {children: ReactNode}) {
  return (
    <span className="inline-block px-4 py-1 text-sm font-semibold tracking-wide bg-black text-white rounded-full">
      {children}
    </span>
  );
}