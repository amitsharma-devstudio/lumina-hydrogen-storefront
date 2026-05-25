import {redirect} from 'react-router';
import type {Route} from './+types/($locale).routine-builder.$step';
import {
  isValidStepKey,
  parseRoutineBuilderSelections,
  routineBuilderPath,
} from '~/lib/routineBuilderParams';

/** Legacy URLs → single wizard page with ?step= */
export async function loader({request, params}: Route.LoaderArgs) {
  const step = params.step ?? '';
  const selections = parseRoutineBuilderSelections(
    new URL(request.url).searchParams,
  );

  if (!isValidStepKey(step)) {
    throw redirect(routineBuilderPath());
  }

  throw redirect(
    routineBuilderPath({
      ...selections,
      step,
    }),
  );
}

export default function RoutineBuilderStepRedirect() {
  return null;
}
