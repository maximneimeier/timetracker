/** Wiederholung für Ausgaben & Angebote */
export type Recurrence = 'daily' | 'weekly' | 'monthly' | 'yearly';

export const RECURRENCE_VALUES: readonly Recurrence[] = ['daily', 'weekly', 'monthly', 'yearly'];

export type QuoteStatus = 'open' | 'closed' | 'paid';

export const QUOTE_STATUS_VALUES: readonly QuoteStatus[] = ['open', 'closed', 'paid'];

export function normalizeRecurrence(v: unknown): Recurrence | null {
  if (typeof v === 'string' && (RECURRENCE_VALUES as readonly string[]).includes(v)) return v as Recurrence;
  return null;
}

export function normalizeQuoteStatus(v: unknown): QuoteStatus {
  if (typeof v === 'string' && (QUOTE_STATUS_VALUES as readonly string[]).includes(v)) return v as QuoteStatus;
  return 'open';
}
