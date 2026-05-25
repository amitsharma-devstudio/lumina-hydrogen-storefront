import {useLoaderData, useSearchParams} from 'react-router';
import type {Route} from './+types/($locale).routine-builder._index';
import {RoutineBuilderPage} from '~/components/routine-builder/RoutineBuilderPage';
import {RoutineBuilderShell} from '~/components/routine-builder/RoutineBuilderShell';
import {loadRoutineBundles} from '~/lib/loadRoutineBundles';
import {
  parseActiveStep,
  parseRoutineBuilderSelections,
} from '~/lib/routineBuilderParams';

export const meta: Route.MetaFunction = () => {
  return [
    {title: 'Build your routine | Lumina'},
    {
      name: 'description',
      content:
        'Choose a skin goal and build a personalized cleanse, treat, and moisturize routine.',
    },
  ];
};

export async function loader({context}: Route.LoaderArgs) {
  const routines = await loadRoutineBundles(context.storefront);
  return {routines};
}

export default function RoutineBuilderIndexRoute() {
  const {routines} = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();
  const selections = parseRoutineBuilderSelections(searchParams);
  const stepParam = parseActiveStep(searchParams);

  return (
    <RoutineBuilderShell>
      <RoutineBuilderPage
        routines={routines}
        selections={selections}
        stepParam={stepParam}
      />
    </RoutineBuilderShell>
  );
}
