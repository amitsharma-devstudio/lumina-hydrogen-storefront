import {useEffect, useMemo, useState} from 'react';
import {Image, Money} from '@shopify/hydrogen';
import {Link, useNavigate} from 'react-router';
import type {RoutineBundle, RoutineProductOption} from '~/lib/routineBundles.types';
import {
  ROUTINE_BUILDER_STEP_KEYS,
  isStepUnlocked,
  routineBuilderPath,
  stepKeyToType,
  type RoutineBuilderSelections,
  type RoutineBuilderStepKey,
} from '~/lib/routineBuilderParams';

const PRODUCTS_PER_PAGE = 8;

type RoutineBuilderWizardProps = {
  routine: RoutineBundle;
  selections: RoutineBuilderSelections;
  activeStep: RoutineBuilderStepKey;
};

function findOption(
  routine: RoutineBundle,
  stepKey: RoutineBuilderStepKey,
  handle: string,
): RoutineProductOption | null {
  const stepType = stepKeyToType(stepKey);
  const step = routine.steps.find((s) => s.step === stepType);
  return step?.options.find((o) => o.productHandle === handle) ?? null;
}

function StepControls({
  routine,
  selections,
  activeStep,
  onStep,
}: {
  routine: RoutineBundle;
  selections: RoutineBuilderSelections;
  activeStep: RoutineBuilderStepKey;
  onStep: (key: RoutineBuilderStepKey) => void;
}) {
  return (
    <>
      <div className="routine-builder__stepper md:hidden" role="tablist">
        {ROUTINE_BUILDER_STEP_KEYS.map((stepKey, index) => {
          const unlocked = isStepUnlocked(stepKey, selections);
          const isActive = stepKey === activeStep;
          const isDone = Boolean(selections[stepKey]);
          const label = stepKeyToType(stepKey);

          return (
            <button
              key={stepKey}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={!unlocked}
              className={`routine-builder__stepper-pill ${
                isActive ? 'routine-builder__stepper-pill--active' : ''
              } ${isDone ? 'routine-builder__stepper-pill--done' : ''}`}
              onClick={() => onStep(stepKey)}
            >
              {index + 1}. {label}
              {isDone ? ' ✓' : ''}
            </button>
          );
        })}
      </div>

      <div className="routine-builder__tabs-row mb-6 hidden md:grid" role="tablist">
        {ROUTINE_BUILDER_STEP_KEYS.map((stepKey, index) => {
          const unlocked = isStepUnlocked(stepKey, selections);
          const isActive = stepKey === activeStep;
          const isDone = Boolean(selections[stepKey]);
          const pick = selections[stepKey]
            ? findOption(routine, stepKey, selections[stepKey])?.productTitle
            : null;

          return (
            <button
              key={stepKey}
              type="button"
              role="tab"
              aria-selected={isActive}
              disabled={!unlocked}
              className={`routine-builder__tab ${
                isActive ? 'routine-builder__tab--active' : ''
              } ${isDone ? 'routine-builder__tab--done' : ''}`}
              onClick={() => onStep(stepKey)}
            >
              <span className="routine-builder__tab-index">
                Step 0{index + 1} · {stepKeyToType(stepKey)}
              </span>
              <span className="font-medium text-[var(--rb-heading)]">
                {stepKeyToType(stepKey)}
              </span>
              <span className="routine-builder__tab-pick truncate">
                {pick ??
                  (unlocked ? 'Choose product' : 'Complete previous step')}
              </span>
            </button>
          );
        })}
      </div>
    </>
  );
}

export function RoutineBuilderWizard({
  routine,
  selections,
  activeStep,
}: RoutineBuilderWizardProps) {
  const navigate = useNavigate();
  const [visibleCount, setVisibleCount] = useState(PRODUCTS_PER_PAGE);

  useEffect(() => {
    setVisibleCount(PRODUCTS_PER_PAGE);
  }, [activeStep]);

  const stepType = stepKeyToType(activeStep);
  const stepDef = routine.steps.find((s) => s.step === stepType);
  const options = stepDef?.options ?? [];
  const visibleOptions = options.slice(0, visibleCount);
  const hasMore = visibleCount < options.length;
  const allComplete = ROUTINE_BUILDER_STEP_KEYS.every((key) => selections[key]);
  const selectedHandle = selections[activeStep];

  const selectionSummary = useMemo(
    () =>
      ROUTINE_BUILDER_STEP_KEYS.map((key) => {
        const handle = selections[key];
        const option = handle ? findOption(routine, key, handle) : null;
        return {
          key,
          type: stepKeyToType(key),
          option,
        };
      }),
    [routine, selections],
  );

  function goToStep(stepKey: RoutineBuilderStepKey) {
    if (!isStepUnlocked(stepKey, selections)) return;
    setVisibleCount(PRODUCTS_PER_PAGE);
    navigate(routineBuilderPath({...selections, step: stepKey}));
  }

  function selectProduct(handle: string) {
    const next = {...selections, [activeStep]: handle} as RoutineBuilderSelections;
    let nextStep: RoutineBuilderStepKey = activeStep;
    if (activeStep === 'cleanse') nextStep = 'treat';
    else if (activeStep === 'treat') nextStep = 'moisturize';
    navigate(routineBuilderPath({...next, step: nextStep}));
  }

  return (
    <>
      <div
        className={`routine-builder__wizard-body mx-auto max-w-5xl px-4 py-6 md:px-6 md:py-12 ${
          allComplete ? 'routine-builder__wizard-body--dock' : ''
        }`}
      >
        <nav className="routine-builder__breadcrumb" aria-label="Breadcrumb">
          <Link to={routineBuilderPath()}>Routine builder</Link>
          <span className="routine-builder__breadcrumb-sep" aria-hidden>
            /
          </span>
          <Link
            to={routineBuilderPath({goal: selections.goal, step: 'cleanse'})}
          >
            {routine.goal}
          </Link>
          <span className="routine-builder__breadcrumb-sep" aria-hidden>
            /
          </span>
          <span className="routine-builder__breadcrumb-current">{stepType}</span>
        </nav>

        <header className="mt-4 mb-6 md:mt-6 md:mb-8">
          <span className="routine-builder__page-header-eyebrow">
            {routine.eyebrow}
          </span>
          <h1 className="routine-builder__title text-2xl md:text-4xl">
            {routine.title}
          </h1>
          <p className="routine-builder__subtitle mt-3 max-w-2xl text-sm leading-relaxed">
            {routine.description}
          </p>
        </header>

        <StepControls
          routine={routine}
          selections={selections}
          activeStep={activeStep}
          onStep={goToStep}
        />

        <div
          className="routine-builder__product-panel"
          role="tabpanel"
          id={`panel-${activeStep}`}
        >
          <div className="mb-4 flex flex-wrap items-end justify-between gap-2 md:mb-5">
            <div>
              <h2 className="routine-builder__title text-lg md:text-2xl">
                Choose your {stepType.toLowerCase()}
              </h2>
              {stepDef?.note ? (
                <p className="routine-builder__subtitle mt-1 text-sm">
                  {stepDef.note}
                </p>
              ) : null}
            </div>
            <p className="routine-builder__subtitle text-xs">
              {options.length} product{options.length === 1 ? '' : 's'}
            </p>
          </div>

          {options.length === 0 ? (
            <p className="routine-builder__subtitle text-sm">
              No products for this step. Check collection and metafields in
              Admin.
            </p>
          ) : (
            <>
              <ul className="routine-builder__product-grid">
                {visibleOptions.map((option) => {
                  const isSelected =
                    option.productHandle === selectedHandle;
                  return (
                    <li key={option.productHandle}>
                      <button
                        type="button"
                        className={`routine-builder__product-card ${
                          isSelected
                            ? 'routine-builder__product-card--selected'
                            : ''
                        }`}
                        onClick={() => selectProduct(option.productHandle)}
                      >
                        <div className="routine-builder__product-card-media">
                          {option.imageUrl ? (
                            <Image
                              data={{
                                url: option.imageUrl,
                                altText:
                                  option.imageAlt ?? option.productTitle,
                              }}
                              width={88}
                              height={88}
                              sizes="88px"
                              className="size-full object-cover"
                            />
                          ) : (
                            <div className="flex size-full items-center justify-center text-[10px] uppercase tracking-widest text-neutral-400">
                              Lumina
                            </div>
                          )}
                        </div>
                        <div className="routine-builder__product-card-body">
                          <span className="routine-builder__product-card-meta">
                            {isSelected ? 'Selected' : 'Tap to select'}
                          </span>
                          <span className="routine-builder__product-card-title">
                            {option.productTitle}
                          </span>
                          {option.price ? (
                            <Money
                              className="routine-builder__product-card-price"
                              data={option.price}
                            />
                          ) : null}
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
              {hasMore ? (
                <div className="mt-6 text-center">
                  <button
                    type="button"
                    className="routine-builder__btn-secondary"
                    onClick={() =>
                      setVisibleCount((n) => n + PRODUCTS_PER_PAGE)
                    }
                  >
                    Load more ({options.length - visibleCount} remaining)
                  </button>
                </div>
              ) : null}
            </>
          )}
        </div>
      </div>

      {allComplete ? (
        <div className="routine-builder__dock" role="region" aria-label="Your routine">
          <div className="routine-builder__dock-inner">
            <p className="routine-builder__dock-title">Your routine is ready</p>
            <ul className="routine-builder__dock-list">
              {selectionSummary.map(({key, type, option}) =>
                option ? (
                  <li key={key} className="routine-builder__dock-row">
                    <span className="routine-builder__dock-row-type">{type}</span>
                    <span className="routine-builder__dock-row-title">
                      {option.productTitle}
                    </span>
                  </li>
                ) : null,
              )}
            </ul>
            <Link
              to={routine.collectionPath}
              prefetch="intent"
              className="routine-builder__btn-primary routine-builder__dock-cta"
            >
              {routine.ctaLabel}
            </Link>
          </div>
        </div>
      ) : null}
    </>
  );
}
