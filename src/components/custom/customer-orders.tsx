// @polsia:user-owned
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { apiFetch } from '@/lib/api-client';
import { formatRandCents, getServicePeriodLabel } from '@/lib/business/service-offers';
import { type ServiceOrderItem, ServiceOrderList } from '@/lib/contracts/service-orders';

export function CustomerOrders() {
  const [orders, setOrders] = useState<ServiceOrderItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiFetch('/api/service-orders', { schema: ServiceOrderList })
      .then((result) => setOrders(result.items))
      .catch(() => setError('Sign in to view service orders for your account.'));
  }, []);

  return (
    <main className="tk-order-page">
      <div className="tk-order-wrap">
        <p className="tk-service-eyebrow">TraceKestrel Assurance · Customer account</p>
        <h1>Your service orders</h1>
        <p className="tk-order-intro">
          Orders are private to the account that placed them. A service stays unpaid until its
          matching payment is verified.
        </p>
        {error ? (
          <div className="tk-order-empty" role="alert">
            <p>{error}</p>
            <Link href="/login?callbackURL=%2Forders">Sign in</Link>
          </div>
        ) : orders === null ? (
          <output className="tk-order-empty">Loading your orders…</output>
        ) : orders.length === 0 ? (
          <div className="tk-order-empty">
            <h2>No service orders yet</h2>
            <p>Choose a managed assurance service to review its scope and total.</p>
            <Link href="/services">View service options</Link>
          </div>
        ) : (
          <ul className="tk-order-list">
            {orders.map((order) => {
              const period = getServicePeriodLabel(order.offerId, order.servicePeriodMonths);
              return (
                <li className="tk-order-card" key={order.id}>
                  <div className="tk-order-card-heading">
                    <div>
                      <p className="tk-order-reference">Order · {order.id}</p>
                      <h2>{order.offerName}</h2>
                    </div>
                    <span
                      className={
                        order.status === 'paid' ? 'tk-order-status is-paid' : 'tk-order-status'
                      }
                    >
                      {order.status === 'paid' ? 'Payment verified' : 'Payment not verified'}
                    </span>
                  </div>
                  <dl className="tk-order-details">
                    <div>
                      <dt>Service period</dt>
                      <dd>{period}</dd>
                    </div>
                    <div>
                      <dt>Scope</dt>
                      <dd>{order.scopeSnapshot}</dd>
                    </div>
                    <div>
                      <dt>Payable total</dt>
                      <dd>{formatRandCents(order.amountCents)}</dd>
                    </div>
                  </dl>
                  {order.status !== 'paid' ? (
                    <p className="tk-order-pending">
                      No verified payment has been recorded. No paid-service action is available for
                      this order.
                    </p>
                  ) : (
                    <Link
                      className="tk-order-intake-link"
                      href={`/services/complete?orderId=${encodeURIComponent(order.id)}`}
                    >
                      Open first-order intake
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
