// @polsia:user-owned
'use client';

import Link from 'next/link';
import { type FormEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { apiFetch } from '@/lib/api-client';
import {
  JOURNEY_SCOPE_OPTIONS,
  type JourneyScope,
  PLATFORM_OPTIONS,
  ServiceOrderIntakeCreateResponse,
  type ServiceOrderIntakeItem,
  ServiceOrderIntakeStateResponse,
  type ServicePlatform,
} from '@/lib/contracts/service-order-intake';

type PageState = 'loading' | 'ready' | 'saved' | 'locked' | 'error';

function apiErrorCode(error: unknown): string | null {
  if (
    error instanceof Error &&
    error.cause !== null &&
    typeof error.cause === 'object' &&
    'error' in error.cause &&
    typeof error.cause.error === 'string'
  ) {
    return error.cause.error;
  }
  return null;
}

function toggleChoice<T extends string>(current: T[], choice: T): T[] {
  return current.includes(choice)
    ? current.filter((value) => value !== choice)
    : [...current, choice];
}

function optionLabel<T extends string>(
  options: ReadonlyArray<{ value: T; label: string }>,
  value: T,
): string {
  return options.find((option) => option.value === value)?.label ?? value;
}

export function ServiceOrderIntakeForm({ orderId }: { orderId: string }) {
  const [pageState, setPageState] = useState<PageState>('loading');
  const [orderName, setOrderName] = useState('');
  const [savedIntake, setSavedIntake] = useState<ServiceOrderIntakeItem | null>(null);
  const [journeyScope, setJourneyScope] = useState<JourneyScope[]>([]);
  const [platforms, setPlatforms] = useState<ServicePlatform[]>([]);
  const [syntheticTestData, setSyntheticTestData] = useState<
    'ready' | 'needs-preparation' | 'not-applicable' | ''
  >('');
  const [accessPrerequisiteStatus, setAccessPrerequisiteStatus] = useState<
    'ready' | 'needs-coordination' | 'not-applicable' | ''
  >('');
  const [formError, setFormError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;
    setPageState('loading');
    apiFetch(`/api/service-orders/intake?orderId=${encodeURIComponent(orderId)}`, {
      schema: ServiceOrderIntakeStateResponse,
    })
      .then((result) => {
        if (!active) return;
        setOrderName(result.order.offerName);
        if (result.intake) {
          setSavedIntake(result.intake);
          setPageState('saved');
        } else {
          setPageState('ready');
        }
      })
      .catch((error: unknown) => {
        if (!active) return;
        const code = apiErrorCode(error);
        if (code === 'paid_order_required' || code === 'order_not_found') {
          setPageState('locked');
          return;
        }
        setPageState('error');
      });

    return () => {
      active = false;
    };
  }, [orderId]);

  async function submitIntake(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError(null);
    if (journeyScope.length === 0 || platforms.length === 0) {
      setFormError('Choose at least one journey area and one platform.');
      return;
    }
    if (!syntheticTestData || !accessPrerequisiteStatus) {
      setFormError('Complete both status selections before submitting.');
      return;
    }

    setSaving(true);
    try {
      const result = await apiFetch('/api/service-orders/intake', {
        method: 'POST',
        body: JSON.stringify({
          orderId,
          journeyScope,
          platforms,
          syntheticTestData,
          accessPrerequisiteStatus,
        }),
        schema: ServiceOrderIntakeCreateResponse,
      });
      setSavedIntake(result.intake);
      setPageState('saved');
      toast.success('First-order intake saved.');
    } catch (error) {
      if (apiErrorCode(error) === 'intake_already_submitted') {
        try {
          const current = await apiFetch(
            `/api/service-orders/intake?orderId=${encodeURIComponent(orderId)}`,
            { schema: ServiceOrderIntakeStateResponse },
          );
          if (current.intake) {
            setSavedIntake(current.intake);
            setPageState('saved');
            toast.success('This order already has an intake.');
            return;
          }
        } catch {
          // The save conflict remains visible through the action error below.
        }
      }
      toast.error('The intake could not be saved. Please try again.');
      setFormError('Your answers were not saved. You can submit again when ready.');
    } finally {
      setSaving(false);
    }
  }

  if (pageState === 'loading') {
    return <output className="tk-intake-notice">Checking this service order…</output>;
  }

  if (pageState === 'locked') {
    return (
      <section className="tk-intake-panel" aria-labelledby="intake-locked-title">
        <p className="tk-service-eyebrow">Paid service intake</p>
        <h2 id="intake-locked-title">Payment verification is required</h2>
        <p>
          This intake opens only for a service order with a verified payment on your customer
          account.
        </p>
        <Link className="tk-service-submit" href="/services">
          View service options
        </Link>
      </section>
    );
  }

  if (pageState === 'error') {
    return (
      <section className="tk-intake-panel" aria-labelledby="intake-error-title">
        <h2 id="intake-error-title">The intake is unavailable</h2>
        <p>
          We could not load this service order. Sign in to the purchasing account and try again.
        </p>
        <Link
          className="tk-service-submit"
          href={`/login?callbackURL=${encodeURIComponent(`/services/complete?orderId=${orderId}`)}`}
        >
          Sign in to continue
        </Link>
      </section>
    );
  }

  if (pageState === 'saved' && savedIntake) {
    return (
      <section className="tk-intake-panel" aria-labelledby="intake-saved-title">
        <p className="tk-service-eyebrow">{orderName || 'Service order'}</p>
        <h2 id="intake-saved-title">Your first-order intake is saved</h2>
        <p>
          The journey, platform, synthetic test data and access-prerequisite choices are attached to
          this verified service order.
        </p>
        <dl className="tk-intake-summary">
          <div>
            <dt>Journey scope</dt>
            <dd>
              {savedIntake.journeyScope
                .map((value) => optionLabel(JOURNEY_SCOPE_OPTIONS, value))
                .join(', ')}
            </dd>
          </div>
          <div>
            <dt>Platforms</dt>
            <dd>
              {savedIntake.platforms
                .map((value) => optionLabel(PLATFORM_OPTIONS, value))
                .join(', ')}
            </dd>
          </div>
          <div>
            <dt>Synthetic test data</dt>
            <dd>{savedIntake.syntheticTestData.replaceAll('-', ' ')}</dd>
          </div>
          <div>
            <dt>Access prerequisites</dt>
            <dd>{savedIntake.accessPrerequisiteStatus.replaceAll('-', ' ')}</dd>
          </div>
        </dl>
        <Link className="tk-intake-secondary-link" href="/orders">
          Return to your service orders
        </Link>
      </section>
    );
  }

  return (
    <section className="tk-intake-panel" aria-labelledby="intake-title">
      <p className="tk-service-eyebrow">{orderName || 'Verified service order'} · First intake</p>
      <h2 id="intake-title">Set the first assurance run in scope.</h2>
      <p className="tk-intake-intro">
        Choose the journey areas and platforms to include, then mark the readiness of synthetic test
        data and access prerequisites.
      </p>
      <p className="tk-intake-privacy">
        This form accepts preset choices only. It does not request or accept passwords, tokens,
        credentials, customer records or other secrets.
      </p>

      <form className="tk-intake-form" onSubmit={submitIntake}>
        <fieldset className="tk-intake-fieldset">
          <legend>Journey scope</legend>
          <p>Select every customer journey area to include.</p>
          <div className="tk-intake-choice-grid">
            {JOURNEY_SCOPE_OPTIONS.map((option) => (
              <label className="tk-intake-choice" key={option.value}>
                <input
                  type="checkbox"
                  name="journeyScope"
                  value={option.value}
                  checked={journeyScope.includes(option.value)}
                  onChange={() => setJourneyScope((current) => toggleChoice(current, option.value))}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="tk-intake-fieldset">
          <legend>Platforms</legend>
          <p>Select every platform in scope.</p>
          <div className="tk-intake-choice-grid tk-intake-platforms">
            {PLATFORM_OPTIONS.map((option) => (
              <label className="tk-intake-choice" key={option.value}>
                <input
                  type="checkbox"
                  name="platforms"
                  value={option.value}
                  checked={platforms.includes(option.value)}
                  onChange={() => setPlatforms((current) => toggleChoice(current, option.value))}
                />
                <span>{option.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <fieldset className="tk-intake-fieldset">
          <legend>Synthetic test data</legend>
          <p>What is the readiness of non-customer test data for this run?</p>
          <div className="tk-intake-choice-grid">
            <label className="tk-intake-choice">
              <input
                type="radio"
                name="syntheticTestData"
                value="ready"
                checked={syntheticTestData === 'ready'}
                onChange={() => setSyntheticTestData('ready')}
              />
              <span>Ready</span>
            </label>
            <label className="tk-intake-choice">
              <input
                type="radio"
                name="syntheticTestData"
                value="needs-preparation"
                checked={syntheticTestData === 'needs-preparation'}
                onChange={() => setSyntheticTestData('needs-preparation')}
              />
              <span>Needs preparation</span>
            </label>
            <label className="tk-intake-choice">
              <input
                type="radio"
                name="syntheticTestData"
                value="not-applicable"
                checked={syntheticTestData === 'not-applicable'}
                onChange={() => setSyntheticTestData('not-applicable')}
              />
              <span>Not applicable</span>
            </label>
          </div>
        </fieldset>

        <fieldset className="tk-intake-fieldset">
          <legend>Access prerequisites</legend>
          <p>Choose the current access-readiness status. Do not include access details.</p>
          <div className="tk-intake-choice-grid">
            <label className="tk-intake-choice">
              <input
                type="radio"
                name="accessPrerequisiteStatus"
                value="ready"
                checked={accessPrerequisiteStatus === 'ready'}
                onChange={() => setAccessPrerequisiteStatus('ready')}
              />
              <span>Ready</span>
            </label>
            <label className="tk-intake-choice">
              <input
                type="radio"
                name="accessPrerequisiteStatus"
                value="needs-coordination"
                checked={accessPrerequisiteStatus === 'needs-coordination'}
                onChange={() => setAccessPrerequisiteStatus('needs-coordination')}
              />
              <span>Needs coordination</span>
            </label>
            <label className="tk-intake-choice">
              <input
                type="radio"
                name="accessPrerequisiteStatus"
                value="not-applicable"
                checked={accessPrerequisiteStatus === 'not-applicable'}
                onChange={() => setAccessPrerequisiteStatus('not-applicable')}
              />
              <span>Not applicable</span>
            </label>
          </div>
        </fieldset>

        {formError ? (
          <p className="tk-intake-form-error" role="alert">
            {formError}
          </p>
        ) : null}
        <button className="tk-service-submit" type="submit" disabled={saving}>
          {saving ? 'Saving intake…' : 'Save first-order intake'}
        </button>
      </form>
    </section>
  );
}
