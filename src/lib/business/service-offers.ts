// @polsia:user-owned

export const SERVICE_OFFER_IDS = [
  'journey-audit',
  'integration-pilot',
  'managed-assurance',
] as const;

export type ServiceOfferId = (typeof SERVICE_OFFER_IDS)[number];
export const SERVICE_PERIOD_OPTIONS = [1, 3, 6] as const;

export interface ServiceOffer {
  id: ServiceOfferId;
  name: string;
  description: string;
  scope: string;
  billingLabel: string;
  amountCents: number;
  monthlyRateCents?: number;
  proposedPrice?: boolean;
}

export const SERVICE_OFFERS: Record<ServiceOfferId, ServiceOffer> = {
  'journey-audit': {
    id: 'journey-audit',
    name: 'Journey Audit',
    description: 'A focused review of the customer paths that matter most.',
    scope: 'Up to three customer journeys.',
    billingLabel: 'One-time service engagement',
    amountCents: 450_000,
  },
  'integration-pilot': {
    id: 'integration-pilot',
    name: 'Integration Pilot',
    description: 'A practical first assurance run across one integration.',
    scope: 'One integration and ten customer journeys.',
    billingLabel: 'One-time service engagement',
    amountCents: 1_200_000,
  },
  'managed-assurance': {
    id: 'managed-assurance',
    name: 'Managed Assurance',
    description: 'Ongoing journey checks and regression coverage over a selected service period.',
    scope:
      'Agreed journey checks, regression coverage and reporting. Exact checks and cadence are confirmed during service setup.',
    billingLabel: 'One payment for the selected period; rate shown monthly',
    amountCents: 850_000,
    monthlyRateCents: 850_000,
    proposedPrice: true,
  },
};

export function getServiceOffer(offerId: string): ServiceOffer | undefined {
  const matchedId = SERVICE_OFFER_IDS.find((candidate) => candidate === offerId);
  return matchedId ? SERVICE_OFFERS[matchedId] : undefined;
}

export function getServiceOrderAmountCents(
  offerId: ServiceOfferId,
  servicePeriodMonths: number,
): number {
  const offer = SERVICE_OFFERS[offerId];
  if (offer.monthlyRateCents) return offer.monthlyRateCents * servicePeriodMonths;
  return offer.amountCents;
}

export function getServicePeriodLabel(offerId: ServiceOfferId, months: number): string {
  if (offerId !== 'managed-assurance') return 'Single engagement';
  return `${months} ${months === 1 ? 'month' : 'months'}`;
}

export function formatRandCents(amountCents: number): string {
  return `R${new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(amountCents / 100)}`;
}
