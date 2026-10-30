// @polsia:user-owned

import type { Metadata } from 'next';
import { CustomerOrders } from '@/components/custom/customer-orders';

export const metadata: Metadata = {
  title: 'Your service orders',
  description: 'Review service orders tied to your TraceKestrel Assurance customer account.',
  alternates: { canonical: '/orders' },
  robots: { index: false, follow: false },
};

export default function OrdersPage() {
  return <CustomerOrders />;
}
