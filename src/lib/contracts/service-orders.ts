// @polsia:user-owned

import { z } from 'zod';
import { SERVICE_OFFER_IDS, SERVICE_PERIOD_OPTIONS } from '@/lib/business/service-offers';

export const ServiceOrderCreate = z
  .object({
    offerId: z.enum(SERVICE_OFFER_IDS),
    servicePeriodMonths: z.number().int().min(1).max(12),
  })
  .superRefine((value, context) => {
    if (
      value.offerId === 'managed-assurance' &&
      !SERVICE_PERIOD_OPTIONS.some((months) => months === value.servicePeriodMonths)
    ) {
      context.addIssue({
        code: 'custom',
        path: ['servicePeriodMonths'],
        message: 'Choose a listed service period.',
      });
    }
    if (value.offerId !== 'managed-assurance' && value.servicePeriodMonths !== 1) {
      context.addIssue({
        code: 'custom',
        path: ['servicePeriodMonths'],
        message: 'Fixed engagements use a single service period.',
      });
    }
  });

export const ServiceOrder = z.object({
  id: z.string(),
  offerId: z.enum(SERVICE_OFFER_IDS),
  offerName: z.string(),
  scopeSnapshot: z.string(),
  servicePeriodMonths: z.number().int(),
  amountCents: z.number().int(),
  currency: z.literal('ZAR'),
  status: z.enum(['pending', 'paid']),
  paidAt: z.string().nullable(),
  createdAt: z.string(),
});

export const ServiceOrderCreateResponse = z.object({ order: ServiceOrder });
export const ServiceOrderList = z.object({ items: z.array(ServiceOrder) });
export const ServiceOrderCheckoutResponse = z.object({ url: z.string().url() });
export const ServiceOrderVerifyResponse = z.object({ status: z.literal('paid') });

export type ServiceOrderCreateInput = z.infer<typeof ServiceOrderCreate>;
export type ServiceOrderItem = z.infer<typeof ServiceOrder>;
