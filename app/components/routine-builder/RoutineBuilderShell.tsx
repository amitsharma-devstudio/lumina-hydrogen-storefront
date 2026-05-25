import type {ReactNode} from 'react';
import {Link} from 'react-router';

type RoutineBuilderShellProps = {
  children: ReactNode;
};

export function RoutineBuilderShell({children}: RoutineBuilderShellProps) {
  return (
    <main className="routine-builder min-h-[70vh]">
      <div className="routine-builder__header-bar">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="routine-builder__header-link">
            Lumina
          </Link>
          <span className="routine-builder__header-label">Routine builder</span>
        </div>
      </div>
      {children}
    </main>
  );
}
