'use client';

import { useState, useEffect } from 'react';
import type { TranslationKey } from '../../lib/i18n';
import {
  getQuotes,
  getCustomers,
  addQuote,
  updateQuote,
  deleteQuote,
  type Quote,
  type Customer,
} from '../../lib/storage';
import type { QuoteStatus, Recurrence } from '../../lib/crmTypes';

export function QuotesSection({
  workspaceId,
  t,
  eurFmt,
  locale,
}: {
  workspaceId: string;
  t: (key: TranslationKey) => string;
  eurFmt: Intl.NumberFormat;
  locale: string;
}) {
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [status, setStatus] = useState<QuoteStatus>('open');
  const [recurring, setRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState<Recurrence>('monthly');
  const [hasEndDate, setHasEndDate] = useState(false);
  const [recurrenceEnd, setRecurrenceEnd] = useState('');

  async function reload() {
    if (!workspaceId) return;
    const [q, c] = await Promise.all([getQuotes(workspaceId), getCustomers(workspaceId)]);
    setQuotes(q);
    setCustomers(c);
    if (c.length && !customerId) setCustomerId(c[0].id);
  }

  useEffect(() => {
    void reload();
  }, [workspaceId]);

  function customerName(id: string): string {
    return customers.find(c => c.id === id)?.name ?? id;
  }

  function recurrenceLabel(r: Recurrence): string {
    if (r === 'daily') return t('recurrenceDaily');
    if (r === 'weekly') return t('recurrenceWeekly');
    if (r === 'monthly') return t('recurrenceMonthly');
    return t('recurrenceYearly');
  }

  function statusLabel(s: QuoteStatus): string {
    if (s === 'open') return t('quoteStatusOpen');
    if (s === 'closed') return t('quoteStatusClosed');
    return t('quoteStatusPaid');
  }

  async function submitNew() {
    const n = parseFloat(amount.replace(',', '.'));
    if (Number.isNaN(n) || n < 0 || !customerId || !workspaceId) return;
    await addQuote(workspaceId, {
      customer_id: customerId,
      title: title.trim(),
      amount: n,
      status,
      is_recurring: recurring,
      recurrence: recurring ? recurrence : null,
      recurrence_end:
        recurring && hasEndDate && recurrenceEnd.trim() ? recurrenceEnd.trim() : recurring && !hasEndDate ? null : null,
    });
    setModalOpen(false);
    setTitle('');
    setAmount('');
    setStatus('open');
    setRecurring(false);
    setRecurrence('monthly');
    setHasEndDate(false);
    setRecurrenceEnd('');
    await reload();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>
            {t('quotesTitle')}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{t('quotesLead')}</p>
        </div>
        <button
          type="button"
          disabled={customers.length === 0}
          onClick={() => {
            if (customers.length) setCustomerId(customers[0].id);
            setModalOpen(true);
          }}
          style={{
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            background: customers.length === 0 ? 'var(--text-disabled)' : 'var(--accent)',
            color: '#fff',
            fontWeight: 600,
            cursor: customers.length === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          + {t('quoteAdd')}
        </button>
      </div>

      {customers.length === 0 && (
        <div
          className="card"
          style={{ padding: '14px 16px', fontSize: '0.875rem', color: 'var(--text-secondary)', borderColor: 'var(--accent-soft)' }}
        >
          {t('customerRequiredQuotes')}
        </div>
      )}

      <div className="card" style={{ padding: '20px' }}>
        {quotes.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('quotesEmpty')}</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {quotes.map(q => (
              <li
                key={q.id}
                style={{
                  padding: '14px',
                  background: 'var(--bg-inner)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', gap: '10px', marginBottom: '10px' }}>
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', fontSize: '1rem' }}>
                      {q.title?.trim() ? q.title : customerName(q.customer_id)} · {eurFmt.format(q.amount)}
                    </div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '6px' }}>
                      {customerName(q.customer_id)} ·{' '}
                      {new Date(q.created_at).toLocaleDateString(locale, { day: 'numeric', month: 'short', year: 'numeric' })}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteQuote(workspaceId, q.id);
                      await reload();
                    }}
                    style={{
                      padding: '6px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: 'var(--danger-soft)',
                      color: 'var(--danger)',
                      alignSelf: 'flex-start',
                    }}
                  >
                    {t('delete')}
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
                  <div>
                    <span style={{ fontSize: '0.7rem', textTransform: 'uppercase', color: 'var(--text-muted)', marginRight: '6px' }}>
                      {t('quoteStatusLabel')}
                    </span>
                    <select
                      value={q.status}
                      onChange={e => {
                        const v = e.target.value as QuoteStatus;
                        void (async () => {
                          await updateQuote(workspaceId, q.id, { status: v });
                          await reload();
                        })();
                      }}
                      style={{ fontSize: '0.8125rem', padding: '6px 8px' }}
                    >
                      {(['open', 'closed', 'paid'] as const).map(s => (
                        <option key={s} value={s}>
                          {statusLabel(s)}
                        </option>
                      ))}
                    </select>
                  </div>
                  {q.is_recurring && q.recurrence ? (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--accent)' }}>
                      ↻ {recurrenceLabel(q.recurrence)}
                      {q.recurrence_end ? ` · ${q.recurrence_end}` : ` · ${t('recurrenceNoEnd')}`}
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>—</span>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1100,
            padding: '16px',
          }}
          onClick={() => setModalOpen(false)}
        >
          <div className="card" style={{ maxWidth: '440px', width: '100%', padding: '22px' }} onClick={e => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '14px' }}>{t('quoteModalTitle')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {t('quotePickCustomer')}
                </label>
                <select value={customerId} onChange={e => setCustomerId(e.target.value)} style={{ width: '100%' }}>
                  {customers.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {t('quoteTitlePlaceholder')}
                </label>
                <input value={title} onChange={e => setTitle(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {t('quoteAmount')}
                </label>
                <input type="text" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {t('quoteStatusLabel')}
                </label>
                <select value={status} onChange={e => setStatus(e.target.value as QuoteStatus)} style={{ width: '100%' }}>
                  {(['open', 'closed', 'paid'] as const).map(s => (
                    <option key={s} value={s}>
                      {statusLabel(s)}
                    </option>
                  ))}
                </select>
              </div>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
                <input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} />
                {t('quoteRecurringLabel')}
              </label>
              {recurring && (
                <>
                  <div>
                    <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                      {t('recurrenceLabel')}
                    </label>
                    <select value={recurrence} onChange={e => setRecurrence(e.target.value as Recurrence)} style={{ width: '100%' }}>
                      {(['daily', 'weekly', 'monthly', 'yearly'] as const).map(r => (
                        <option key={r} value={r}>
                          {recurrenceLabel(r)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.875rem', cursor: 'pointer' }}>
                    <input type="checkbox" checked={hasEndDate} onChange={e => setHasEndDate(e.target.checked)} />
                    {t('recurrenceEndLabel')}
                  </label>
                  {hasEndDate && <input type="date" value={recurrenceEnd} onChange={e => setRecurrenceEnd(e.target.value)} />}
                  {!hasEndDate && (
                    <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t('recurrenceNoEnd')}</p>
                  )}
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-inner)',
                  cursor: 'pointer',
                }}
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={() => void submitNew()}
                style={{
                  flex: 1,
                  padding: '11px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--success)',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {t('save')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
