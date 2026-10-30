// @polsia:user-owned — seeded by polsia/modules/better-auth; restyle freely.

import type { Metadata } from 'next';
import Link from 'next/link';
import { SignUpForm } from '@/components/custom/sign-up-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { safeReturnPath } from '@/lib/business/return-path';

export const metadata: Metadata = {
  title: 'Create an account',
  description: 'Create a TraceKestrel Assurance customer account for service checkout.',
  robots: { index: false, follow: false },
};

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackURL?: string | string[] }>;
}) {
  const params = await searchParams;
  const callbackURL = safeReturnPath(params.callbackURL);
  const loginHref = `/login?callbackURL=${encodeURIComponent(callbackURL)}`;

  return (
    <main className="tk-auth-screen">
      <section className="tk-auth-panel" aria-labelledby="signup-title">
        <div className="tk-auth-kicker">TraceKestrel Assurance · Customer account</div>
        <Card className="tk-auth-card">
          <CardHeader className="text-left pb-2">
            <CardTitle id="signup-title" className="text-h4">
              Create a customer account
            </CardTitle>
            <CardDescription>
              Save your service order and continue to checkout. No workspace or membership is
              needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-4">
            <SignUpForm callbackURL={callbackURL} />
            <p className="mt-4 text-center text-small text-muted-foreground">
              Already have an account?{' '}
              <Link href={loginHref} className="tk-auth-text-link">
                Sign in
              </Link>
            </p>
          </CardContent>
        </Card>
        <p className="tk-auth-note">
          Creating an account does not start payment or activate service.
        </p>
      </section>
    </main>
  );
}
