// @polsia:user-owned
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ServiceOrderIntakeForm } from '@/components/custom/service-order-intake-form';
import { apiFetch } from '@/lib/api-client';
import { ServiceOrderIntakeStateResponse } from '@/lib/contracts/service-order-intake';
import { ServiceOrderVerifyResponse } from '@/lib/contracts/service-orders';

type VerificationState = 'checking' | 'verified' | 'unverified';

function verificationErrorCode(error: unknown): string | null {
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

export function PaymentVerification({
  orderId,
  sessionId,
}: {
  orderId: string;
  sessionId: string;
}) {
  const [state, setState] = useState<VerificationState>('checking');
  const [retry, setRetry] = useState(0);

  useEffect(() => {
    let active = true;
    setState('checking');
    if (!orderId) {
      setState('unverified');
      return () => {
        active = false;
      };
    }

    async function checkOrder() {
      const retryDelay = retry === 0 ? 1500 : 900;
      if (!sessionId) {
        try {
          await apiFetch(`/api/service-orders/intake?orderId=${encodeURIComponent(orderId)}`, {
            schema: ServiceOrderIntakeStateResponse,
          });
          if (active) setState('verified');
        } catch {
          if (active) setState('unverified');
        }
        return;
      }

      for (let attempt = 0; attempt < 10; attempt += 1) {
        if (!active) return;
        try {
          await apiFetch('/api/service-orders/verify', {
            method: 'POST',
            body: JSON.stringify({ orderId, sessionId }),
            schema: ServiceOrderVerifyResponse,
          });
          if (active) setState('verified');
          return;
        } catch (error) {
          const code = verificationErrorCode(error);
          const canRetry = code === 'payment_pending';
          if (!canRetry || attempt === 9) {
            if (active) setState('unverified');
            return;
          }
          await new Promise((resolve) => window.setTimeout(resolve, retryDelay));
        }
      }
    }

    void checkOrder();
    return () => {
      active = false;
    };
  }, [orderId, retry, sessionId]);

  return (
    <main className="tk-order-page">
      <section className="tk-order-result" aria-live="polite">
        <p className="tk-service-eyebrow">TraceKestrel Assurance · Payment status</p>
        {state === 'checking' ? (
          <>
            <h1>Checking your payment</h1>
            <p>We are verifying this payment against your account and service order.</p>
          </>
        ) : state === 'verified' ? (
          <>
            <h1>Payment verified for your order</h1>
            <p>
              This order belongs to your customer account. Complete the first-order intake to set
              its journey, platform and readiness scope.
            </p>
            <ServiceOrderIntakeForm orderId={orderId} />
          </>
        ) : (
          <>
            <h1>Payment not verified</h1>
            <p>
              No paid access was granted. The payment must be verified for this exact order and
              account before the intake can open. Pending, failed or unavailable verification keeps
              the form locked.
            </p>
            {sessionId ? (
              <button
                className="tk-service-submit"
                type="button"
                onClick={() => setRetry((current) => current + 1)}
              >
                Check payment again
              </button>
            ) : null}
          </>
        )}
        {state !== 'verified' ? (
          <>
            <Link href="/orders" className="tk-order-result-link">
              View your orders
            </Link>
            <Link href="/services" className="tk-order-result-link">
              Return to service options
            </Link>
          </>
        ) : null}
      </section>
    </main>
  );
}
