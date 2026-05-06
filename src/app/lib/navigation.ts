/** Verhindert Open-Redirect-Angriffe per ?next=. */
export function getSafeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/dashboard';
  return raw;
}
