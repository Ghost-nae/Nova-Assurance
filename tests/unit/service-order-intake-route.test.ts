// @vitest-environment node
import { beforeAll, beforeEach, describe, expect, it, vi } from 'vitest';

const doubles = vi.hoisted(() => ({
  findOrder: vi.fn(),
  findIntake: vi.fn(),
  createIntake: vi.fn(),
  updateOrder: vi.fn(),
  verifyCheckout: vi.fn(),
  requireAuth: vi.fn(),
  sameOrigin: vi.fn(),
}));

vi.mock('server-only', () => ({}));
vi.mock('@/lib/db', () => ({
  prisma: {
    serviceOrder: { findFirst: doubles.findOrder, updateMany: doubles.updateOrder },
    serviceOrderIntake: { findUnique: doubles.findIntake, create: doubles.createIntake },
  },
}));
vi.mock('@/lib/require-auth', () => ({ requireAuth: doubles.requireAuth }));
vi.mock('@/lib/same-origin', () => ({ sameOrigin: doubles.sameOrigin }));
vi.mock('@/lib/stripe-billing/client', () => ({ verifyCheckoutSession: doubles.verifyCheckout }));

import { ServiceOrderIntakeSubmission } from '@/lib/contracts/service-order-intake';

let submitIntake: (request: Request) => Promise<Response>;
let verifyOrderPayment: (request: Request) => Promise<Response>;

beforeAll(async () => {
  ({ POST: submitIntake } = await import('@/app/api/service-orders/intake/route'));
  ({ POST: verifyOrderPayment } = await import('@/app/api/service-orders/verify/route'));
});

const paidOrder = {
  id: 'order-1',
  userId: 'buyer-1',
  offerName: 'Integration Pilot',
  status: 'paid',
  paidAt: new Date('2026-10-27T12:00:00.000Z'),
  stripeSessionId: 'cs_order_1',
};

const validIntake = {
  orderId: 'order-1',
  journeyScope: ['qualification', 'booking'],
  platforms: ['web', 'api'],
  syntheticTestData: 'ready',
  accessPrerequisiteStatus: 'needs-coordination',
};

function postRequest(path: string, body: unknown): Request {
  return new Request(`http://localhost${path}`, {
    method: 'POST',
    headers: { origin: 'http://localhost:3000', 'content-type': 'application/json' },
    body: JSON.stringify(body),
  });
}

describe('Service order intake API routes', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    doubles.requireAuth.mockResolvedValue({ id: 'buyer-1', email: 'buyer@example.test' });
    doubles.sameOrigin.mockReturnValue(true);
  });

  it('creates a first intake for the signed-in purchaser and links it to their paid order', async () => {
    doubles.findOrder.mockResolvedValue(paidOrder);
    doubles.createIntake.mockImplementation(async (args: { data: Record<string, unknown> }) => ({
      id: 'intake-1',
      serviceOrderId: args.data.serviceOrderId,
      journeyScope: args.data.journeyScope,
      platforms: args.data.platforms,
      syntheticTestData: args.data.syntheticTestData,
      accessPrerequisiteStatus: args.data.accessPrerequisiteStatus,
      createdAt: new Date('2026-10-27T12:30:00.000Z'),
    }));

    const response = await submitIntake(
      postRequest('/api/service-orders/intake', validIntake),
    );

    expect(response.status).toBe(201);
    expect(doubles.findOrder).toHaveBeenCalledWith(
      expect.objectContaining({ where: { id: 'order-1', userId: 'buyer-1' } }),
    );
    expect(doubles.createIntake).toHaveBeenCalledWith(
      expect.objectContaining({
        data: expect.objectContaining({
          serviceOrderId: 'order-1',
          userId: 'buyer-1',
          journeyScope: ['qualification', 'booking'],
          platforms: ['web', 'api'],
        }),
      }),
    );
    expect(await response.json()).toMatchObject({ intake: { id: 'intake-1', serviceOrderId: 'order-1' } });
  });

  it('rejects unknown secret fields and pending orders without creating an intake', async () => {
    const secretPayload = { ...validIntake, password: 'synthetic-secret' };
    expect(ServiceOrderIntakeSubmission.safeParse(secretPayload).success).toBe(false);

    const invalidResponse = await submitIntake(
      postRequest('/api/service-orders/intake', secretPayload),
    );
    expect(invalidResponse.status).toBe(400);
    expect(doubles.findOrder).not.toHaveBeenCalled();

    doubles.findOrder.mockResolvedValue({ ...paidOrder, status: 'pending', paidAt: null });
    const pendingResponse = await submitIntake(
      postRequest('/api/service-orders/intake', validIntake),
    );
    expect(pendingResponse.status).toBe(403);
    expect(doubles.createIntake).not.toHaveBeenCalled();
  });

  it('does not mark payment verified for a missing purchaser order, failed payment, wrong buyer or unavailable verifier', async () => {
    const paymentRequest = postRequest('/api/service-orders/verify', {
      orderId: 'order-1',
      sessionId: 'cs_order_1',
    });

    doubles.findOrder.mockResolvedValueOnce(null);
    const otherPurchaserResponse = await verifyOrderPayment(paymentRequest.clone());
    expect(otherPurchaserResponse.status).toBe(404);
    expect(doubles.verifyCheckout).not.toHaveBeenCalled();

    const pendingUsdOrder = {
      ...paidOrder,
      status: 'pending',
      paidAt: null,
      currency: 'USD',
      amountCents: 4500,
    };
    doubles.findOrder.mockResolvedValue(pendingUsdOrder);
    doubles.verifyCheckout.mockResolvedValueOnce({ verified: false, payment: null });
    const failedPaymentResponse = await verifyOrderPayment(paymentRequest.clone());
    expect(failedPaymentResponse.status).toBe(409);
    expect(doubles.updateOrder).not.toHaveBeenCalled();

    doubles.verifyCheckout.mockResolvedValueOnce({
      verified: true,
      payment: {
        customer_email: 'someone-else@example.test',
        gross_amount_usd: 45,
        paid_at: null,
      },
    });
    const wrongBuyerResponse = await verifyOrderPayment(paymentRequest.clone());
    expect(wrongBuyerResponse.status).toBe(409);
    expect(doubles.updateOrder).not.toHaveBeenCalled();

    doubles.verifyCheckout.mockRejectedValueOnce(new Error('verification unavailable'));
    const unavailableResponse = await verifyOrderPayment(paymentRequest);
    expect(unavailableResponse.status).toBe(503);
    expect(doubles.updateOrder).not.toHaveBeenCalled();
  });

  it('marks an order paid only after a verified checkout matches its purchaser and total', async () => {
    const pendingUsdOrder = {
      ...paidOrder,
      status: 'pending',
      paidAt: null,
      currency: 'USD',
      amountCents: 4500,
    };
    doubles.findOrder.mockResolvedValue(pendingUsdOrder);
    doubles.verifyCheckout.mockResolvedValue({
      verified: true,
      payment: {
        customer_email: 'BUYER@example.test',
        gross_amount_usd: 45,
        paid_at: '2026-10-27T12:00:00.000Z',
      },
    });
    doubles.updateOrder.mockResolvedValue({ count: 1 });

    const response = await verifyOrderPayment(
      postRequest('/api/service-orders/verify', {
        orderId: 'order-1',
        sessionId: 'cs_order_1',
      }),
    );

    expect(response.status).toBe(200);
    expect(doubles.updateOrder).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({ id: 'order-1', userId: 'buyer-1' }),
        data: expect.objectContaining({ status: 'paid' }),
      }),
    );
    expect(await response.json()).toEqual({ status: 'paid' });
  });
});
