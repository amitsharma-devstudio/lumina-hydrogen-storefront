import type {RoutineBundle} from '~/lib/routineBundles.types';
import {
  resolveActiveStep,
  type RoutineBuilderSelections,
  type RoutineBuilderStepKey,
} from '~/lib/routineBuilderParams';
import {RoutineBuilderGoalSelect} from '~/components/routine-builder/RoutineBuilderGoalSelect';
import {RoutineBuilderWizard} from '~/components/routine-builder/RoutineBuilderWizard';

type RoutineBuilderPageProps = {
  routines: RoutineBundle[];
  selections: RoutineBuilderSelections;
  stepParam: RoutineBuilderStepKey | null;
};

export function RoutineBuilderPage({
  routines,
  selections,
  stepParam,
}: RoutineBuilderPageProps) {
  const activeRoutine = routines.find(
    (r) => r.bundleKey === selections.goal,
  );

  if (!selections.goal || !activeRoutine) {
    return <RoutineBuilderGoalSelect routines={routines} />;
  }

  const activeStep = resolveActiveStep(selections, stepParam);

  return (
    <RoutineBuilderWizard
      routine={activeRoutine}
      selections={selections}
      activeStep={activeStep}
    />
  );
}
