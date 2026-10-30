// @polsia:user-owned
'use client';

import Link from 'next/link';
import { useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { useSession } from '@/lib/auth-client';
import {
  formatRandCents,
  getServiceOrderAmountCents,
  getServicePeriodLabel,
  SERVICE_OFFER_IDS,
  SERVICE_OFFERS,
  SERVICE_PERIOD_OPTIONS,
  type ServiceOfferId,
} from '@/lib/business/service-offers';
import {
  ServiceOrderCheckoutResponse,
  ServiceOrderCreateResponse,
} from '@/lib/contracts/service-orders';

const offers = SERVICE_OFFER_IDS.map((id) => SERVICE_OFFERS[id]);

function responseMessage(error: unknown): string {
  if (
    error instanceof Error &&
    error.cause !== null &&
    typeof error.cause === 'object' &&
    'message' in error.cause &&
    typeof error.cause.message === 'string'
  ) {
    return error.cause.message;
  }
  return 'Checkout could not be started. No payment or service activation has occurred.';
}

export function ServiceCheckout({
  initialOfferId,
  initialPeriodMonths,
}: {
  initialOfferId: ServiceOfferId;
  initialPeriodMonths: number;
}) {
  const { data: session, isPending } = useSession();
  const [offerId, setOfferId] = useState<ServiceOfferId>(initialOfferId);
  const [periodMonths, setPeriodMonths] = useState(initialPeriodMonths);
  const [submitting, setSubmitting] = useState(false);
  const [checkoutMessage, setCheckoutMessage] = useState<string | null>(null);
  const [savedOrderId, setSavedOrderId] = useState<string | null>(null);
  const offer = SERVICE_OFFERS[offerId];
  const totalCents = getServiceOrderAmountCents(offerId, periodMonths);
  const selectedPeriod = getServicePeriodLabel(offerId, periodMonths);
  const returnPath = `/services?offer=${offerId}&months=${periodMonths}`;
  const signupHref = `/signup?callbackURL=${encodeURIComponent(returnPath)}`;
  const loginHref = `/login?callbackURL=${encodeURIComponent(returnPath)}`;

  async function startCheckout() {
    setSubmitting(true);
    setCheckoutMessage(null);
    try {
      let orderId = savedOrderId;
      if (!orderId) {
        const { order } = await apiFetch('/api/service-orders', {
          method: 'POST',
          body: JSON.stringify({ offerId, servicePeriodMonths: periodMonths }),
          schema: ServiceOrderCreateResponse,
        });
        orderId = order.id;
        setSavedOrderId(orderId);
      }
      const checkout = await apiFetch('/api/stripe-billing/checkout', {
        method: 'POST',
        body: JSON.stringify({ orderId }),
        schema: ServiceOrderCheckoutResponse,
      });
      window.location.assign(checkout.url);
    } catch (error) {
      setCheckoutMessage(responseMessage(error));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="tk-service-wrap">
      <header className="tk-service-intro">
        <p className="tk-service-eyebrow">Managed workflow assurance · South Africa</p>
        <h1>Choose the service scope that fits your team.</h1>
        <p>
          Each engagement checks the handoff between a customer conversation and the systems that
          need to respond. Review the selected scope and total before any payment step.
        </p>
      </header>

      <div className="tk-service-grid">
        <section aria-labelledby="offer-list-title" className="tk-service-offers">
          <div className="tk-service-section-heading">
            <span>01 / Select a service</span>
            <h2 id="offer-list-title">Service options</h2>
          </div>
          <div className="tk-service-offer-list">
            {offers.map((item, index) => {
              const selected = item.id === offerId;
              return (
                <button
                  key={item.id}
                  type="button"
                  className={`tk-service-offer${selected ? ' is-selected' : ''}`}
                  aria-pressed={selected}
                  onClick={() => {
                    setOfferId(item.id);
                    setCheckoutMessage(null);
                    setSavedOrderId(null);
                  }}
                >
                  <span className="tk-service-offer-index">0{index + 1}</span>
                  <span className="tk-service-offer-main">
                    <span className="tk-service-offer-name">{item.name}</span>
                    <span className="tk-service-offer-description">{item.description}</span>
                    <span className="tk-service-offer-scope">{item.scope}</span>
                  </span>
                  <span className="tk-service-offer-price">
                    {item.monthlyRateCents
                      ? `${formatRandCents(item.monthlyRateCents)} / month`
                      : formatRandCents(item.amountCents)}
                    <small>
                      {item.proposedPrice
                        ? `Proposed sample · ${item.billingLabel}`
                        : item.billingLabel}
                    </small>
                  </span>
                </button>
              );
            })}
          </div>

          {offerId === 'managed-assurance' ? (
            <div className="tk-service-period">
              <label htmlFor="service-period">02 / Select service period</label>
              <select
                id="service-period"
                value={periodMonths}
                onChange={(event) => {
                  setPeriodMonths(Number(event.currentTarget.value));
                  setCheckoutMessage(null);
                  setSavedOrderId(null);
                }}
              >
                {SERVICE_PERIOD_OPTIONS.map((months) => (
                  <option key={months} value={months}>
                    {months} {months === 1 ? 'month' : 'months'}
                  </option>
                ))}
              </select>
              <p>
                One payment for the selected period. The monthly rate is multiplied by the selected
                duration and shown as one total.
              </p>
            </div>
          ) : null}
        </section>

        <aside className="tk-service-summary" aria-labelledby="summary-title">
          <p className="tk-service-section-label">03 / Review before payment</p>
          <h2 id="summary-title">Your service summary</h2>
          <dl className="tk-service-summary-list">
            <div>
              <dt>Selected service</dt>
              <dd>{offer.name}</dd>
            </div>
            <div>
              <dt>Service period</dt>
              <dd>{selectedPeriod}</dd>
            </div>
            <div>
              <dt>Scope</dt>
              <dd>{offer.scope}</dd>
            </div>
            <div>
              <dt>Billing</dt>
              <dd>{offer.billingLabel}</dd>
            </div>
            {offer.monthlyRateCents ? (
              <div>
                <dt>Monthly rate</dt>
                <dd>
                  {formatRandCents(offer.monthlyRateCents)}
                  {offer.proposedPrice ? ' · proposed sample' : ''}
                </dd>
              </div>
            ) : null}
            <div className="tk-service-total">
              <dt>Payable total</dt>
              <dd>{formatRandCents(totalCents)}</dd>
            </div>
          </dl>

          {offer.proposedPrice ? (
            <p className="tk-service-sample-note">
              Managed Assurance pricing is a proposed sample until TraceKestrel confirms the monthly
              rate.
            </p>
          ) : null}

          <p className="tk-service-managed-note">
            A managed service engagement, not software access.
          </p>

          {isPending ? (
            <output className="tk-service-auth-note">Checking your customer account…</output>
          ) : session?.user ? (
            <button
              type="button"
              className="tk-service-submit"
              onClick={startCheckout}
              disabled={submitting}
            >
              {submitting
                ? 'Preparing order…'
                : savedOrderId
                  ? 'Retry checkout'
                  : 'Continue to checkout'}
            </button>
          ) : (
            <div className="tk-service-auth-actions">
              <Link className="tk-service-submit" href={signupHref}>
                Create account to continue
              </Link>
              <Link className="tk-service-signin" href={loginHref}>
                Already have an account? Sign in
              </Link>
            </div>
          )}

          {checkoutMessage ? (
            <div className="tk-service-unavailable" role="alert">
              <strong>Checkout unavailable</strong>
              <p>{checkoutMessage}</p>
              {savedOrderId ? (
                <p>
                  Order <code>{savedOrderId}</code> is saved as unpaid.{' '}
                  <Link href="/orders">View your orders</Link>.
                </p>
              ) : null}
              <p>No payment or service activation has occurred.</p>
            </div>
          ) : null}

          <p className="tk-service-reassurance">
            Your order is tied to your account. Service access only follows a verified payment for
            that order.
          </p>
        </aside>
      </div>
    </div>
  );
}
