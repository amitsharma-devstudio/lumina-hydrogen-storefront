import type {ReactNode} from 'react';

export function PredictiveSearchGroup({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <div className="predictive-search-group mb-8">
      <p className="mb-3 text-[10px] font-medium uppercase tracking-[0.15em] text-neutral-500">
        {eyebrow}
      </p>
      {children}
    </div>
  );
}
