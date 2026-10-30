// @polsia:user-owned

import { z } from 'zod';

const JOURNEY_SCOPE_VALUES = [
  'lead-capture',
  'qualification',
  'booking',
  'checkout',
  'confirmation',
  'follow-up',
  'account-access',
] as const;

const SERVICE_PLATFORM_VALUES = ['web', 'ios', 'android', 'api'] as const;

export const JOURNEY_SCOPE = z.enum(JOURNEY_SCOPE_VALUES);
export const SERVICE_PLATFORM = z.enum(SERVICE_PLATFORM_VALUES);

export const JOURNEY_SCOPE_OPTIONS = [
  { value: 'lead-capture', label: 'Lead capture' },
  { value: 'qualification', label: 'Qualification' },
  { value: 'booking', label: 'Booking or scheduling' },
  { value: 'checkout', label: 'Checkout or payment' },
  { value: 'confirmation', label: 'Confirmation' },
  { value: 'follow-up', label: 'Follow-up' },
  { value: 'account-access', label: 'Account access' },
] as const satisfies ReadonlyArray<{ value: (typeof JOURNEY_SCOPE_VALUES)[number]; label: string }>;

export const PLATFORM_OPTIONS = [
  { value: 'web', label: 'Web' },
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'api', label: 'API' },
] as const satisfies ReadonlyArray<{
  value: (typeof SERVICE_PLATFORM_VALUES)[number];
  label: string;
}>;

export const ServiceOrderIntakeSubmission = z
  .object({
    orderId: z.string().min(1).max(128),
    journeyScope: z.array(JOURNEY_SCOPE).min(1).max(JOURNEY_SCOPE_OPTIONS.length),
    platforms: z.array(SERVICE_PLATFORM).min(1).max(PLATFORM_OPTIONS.length),
    syntheticTestData: z.enum(['ready', 'needs-preparation', 'not-applicable']),
    accessPrerequisiteStatus: z.enum(['ready', 'needs-coordination', 'not-applicable']),
  })
  .strict()
  .superRefine((value, context) => {
    if (new Set(value.journeyScope).size !== value.journeyScope.length) {
      context.addIssue({
        code: 'custom',
        path: ['journeyScope'],
        message: 'Choose each journey area once.',
      });
    }
    if (new Set(value.platforms).size !== value.platforms.length) {
      context.addIssue({
        code: 'custom',
        path: ['platforms'],
        message: 'Choose each platform once.',
      });
    }
  });

export const ServiceOrderIntake = z.object({
  id: z.string(),
  serviceOrderId: z.string(),
  journeyScope: z.array(JOURNEY_SCOPE),
  platforms: z.array(SERVICE_PLATFORM),
  syntheticTestData: z.enum(['ready', 'needs-preparation', 'not-applicable']),
  accessPrerequisiteStatus: z.enum(['ready', 'needs-coordination', 'not-applicable']),
  createdAt: z.string(),
});

export const ServiceOrderIntakeCreateResponse = z.object({ intake: ServiceOrderIntake });
export const ServiceOrderIntakeStateResponse = z.object({
  order: z.object({ id: z.string(), offerName: z.string() }),
  intake: ServiceOrderIntake.nullable(),
});

export type ServiceOrderIntakeSubmissionInput = z.infer<typeof ServiceOrderIntakeSubmission>;
export type ServiceOrderIntakeItem = z.infer<typeof ServiceOrderIntake>;
export type JourneyScope = z.infer<typeof JOURNEY_SCOPE>;
export type ServicePlatform = z.infer<typeof SERVICE_PLATFORM>;
