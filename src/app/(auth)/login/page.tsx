// @polsia:user-owned — seeded by polsia/modules/better-auth; restyle freely.

import type { Metadata } from 'next';
import Link from 'next/link';
import { SignInForm } from '@/components/custom/sign-in-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { safeReturnPath } from '@/lib/business/return-path';

export const metadata: Metadata = {
  title: 'Sign in',
  description: 'Sign in to manage your TraceKestrel Assurance service orders.',
  robots: { index: false, follow: false },
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackURL?: string | string[] }>;
}) {
  const params = await searchParams;
  const callbackURL = safeReturnPath(params.callbackURL);
  const signupHref = `/signup?callbackURL=${encodeURIComponent(callbackURL)}`;

  return (
    <main className="tk-auth-screen">
      <section className="tk-auth-panel" aria-labelledby="login-title">
        <div className="tk-auth-kicker">TraceKestrel Assurance · Customer account</div>
        <Card className="tk-auth-card">
          <CardHeader className="text-left pb-2">
            <CardTitle id="login-title" className="text-h4">
              Welcome back
            </CardTitle>
            <CardDescription>
              Sign in to review your service order and continue to checkout.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <SignInForm callbackURL={callbackURL} />
            <p className="mt-4 text-center text-small text-muted-foreground">
              New to TraceKestrel?{' '}
              <Link href={signupHref} className="tk-auth-text-link">
                Create a customer account
              </Link>
            </p>
          </CardContent>
        </Card>
        <p className="tk-auth-note">
          No workspace or membership is required to place a service order.
        </p>
      </section>
    </main>
  );
}
