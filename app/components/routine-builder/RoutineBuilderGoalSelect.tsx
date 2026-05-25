import {Link} from 'react-router';
import type {RoutineBundle} from '~/lib/routineBundles.types';
import {routineBuilderPath} from '~/lib/routineBuilderParams';

type RoutineBuilderGoalSelectProps = {
  routines: RoutineBundle[];
};

export function RoutineBuilderGoalSelect({routines}: RoutineBuilderGoalSelectProps) {
  return (
    <div className="mx-auto max-w-3xl px-6 py-10 md:py-14">
      <header className="mb-10 text-center md:mb-12">
        <span className="routine-builder__page-header-eyebrow">Step 1 of 2</span>
        <h1 className="routine-builder__title text-3xl md:text-4xl">
          What is your main skin goal?
        </h1>
        <p className="routine-builder__subtitle mt-3 text-sm">
          Hover a card to preview — select to build your three-step routine.
        </p>
      </header>
      <ul className="grid gap-4 sm:grid-cols-2">
        {routines.map((routine) => (
          <li key={routine.id}>
            <Link
              to={routineBuilderPath({
                goal: routine.bundleKey,
                step: 'cleanse',
              })}
              prefetch="intent"
              className="routine-builder__goal-card"
            >
              <span className="routine-builder__goal-card-eyebrow block">
                {routine.eyebrow}
              </span>
              <span className="routine-builder__goal-card-title block">
                {routine.goal}
              </span>
              <span className="routine-builder__goal-card-desc">
                {routine.result}
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
