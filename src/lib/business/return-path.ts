// @polsia:user-owned

export function safeReturnPath(
  candidate: string | string[] | undefined,
  fallback = '/profile',
): string {
  const value = Array.isArray(candidate) ? candidate[0] : candidate;
  if (!value || !value.startsWith('/') || value.startsWith('//')) return fallback;

  try {
    const base = new URL('https://tracekestrel.invalid');
    const target = new URL(value, base);
    if (target.origin !== base.origin) return fallback;
    return `${target.pathname}${target.search}${target.hash}`;
  } catch {
    return fallback;
  }
}
