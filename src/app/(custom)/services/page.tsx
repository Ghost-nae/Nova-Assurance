// @polsia:user-owned

import type { Metadata } from 'next';
import { ServiceCheckout } from '@/components/custom/service-checkout';
import {
  getServiceOffer,
  SERVICE_OFFER_IDS,
  SERVICE_PERIOD_OPTIONS,
  type ServiceOfferId,
} from '@/lib/business/service-offers';

export const metadata: Metadata = {
  title: 'Service options',
  description:
    'Review TraceKestrel Assurance service scope and pricing for a journey audit, integration pilot or managed assurance period.',
  alternates: { canonical: '/services' },
};

function initialOffer(value: string | undefined): ServiceOfferId {
  return getServiceOffer(value ?? '')?.id ?? SERVICE_OFFER_IDS[0];
}

function initialPeriod(value: string | undefined): number {
  const parsed = Number(value);
  return SERVICE_PERIOD_OPTIONS.find((months) => months === parsed) ?? 1;
}

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<{ offer?: string; months?: string }>;
}) {
  const params = await searchParams;

  return (
    <main className="tk-service-page">
      <ServiceCheckout
        initialOfferId={initialOffer(params.offer)}
        initialPeriodMonths={initialPeriod(params.months)}
      />
    </main>
  );
}
