// @polsia:user-owned

import type { Metadata } from 'next';
import { PaymentVerification } from '@/components/custom/payment-verification';

export const metadata: Metadata = {
  title: 'Payment status',
  description: 'Verify payment status for a TraceKestrel Assurance service order.',
  robots: { index: false, follow: false },
};

export default async function ServiceCompletePage({
  searchParams,
}: {
  searchParams: Promise<{ orderId?: string; session_id?: string }>;
}) {
  const params = await searchParams;
  return <PaymentVerification orderId={params.orderId ?? ''} sessionId={params.session_id ?? ''} />;
}
