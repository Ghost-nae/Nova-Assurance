// @polsia:user-owned — seeded by polsia/modules/better-auth; restyle freely.
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { signOut, useSession } from '@/lib/auth-client';

export function AuthNav() {
  const { data: session, isPending } = useSession();

  // Render nothing until the session resolves — avoids a Sign-in→Profile flash.
  if (isPending) return null;

  if (!session?.user) {
    return (
      <nav className="tk-auth-nav" aria-label="Account">
        <Button asChild variant="ghost">
          <Link href="/login" className="tk-auth-link">
            Sign in
          </Link>
        </Button>
        <Button asChild variant="secondary">
          <Link href="/signup" className="tk-auth-link tk-auth-link-primary">
            Create account
          </Link>
        </Button>
      </nav>
    );
  }

  return (
    <nav className="tk-auth-nav" aria-label="Account">
      <Button asChild variant="ghost">
        <Link href="/profile" className="tk-auth-link">
          Profile
        </Link>
      </Button>
      <Button
        variant="secondary"
        className="tk-auth-link tk-auth-link-primary"
        onClick={async () => {
          await signOut();
          window.location.assign('/');
        }}
      >
        Sign out
      </Button>
    </nav>
  );
}
