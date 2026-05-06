'use client';

import { useState, useEffect, useMemo } from 'react';
import type { TranslationKey } from '../../lib/i18n';
import {
  getCustomers,
  getExpenses,
  addExpense,
  deleteExpense,
  type Customer,
  type Expense,
} from '../../lib/storage';
import type { Recurrence } from '../../lib/crmTypes';

export function ExpensesSection({
  workspaceId,
  t,
  locale,
  eurFmt,
}: {
  workspaceId: string;
  t: (key: TranslationKey) => string;
  locale: string;
  eurFmt: Intl.NumberFormat;
}) {
  const [items, setItems] = useState<Expense[]>([]);
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [expenseMonth, setExpenseMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [modalOpen, setModalOpen] = useState(false);
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [memo, setMemo] = useState('');
  const [customerId, setCustomerId] = useState('');
  const [recurring, setRecurring] = useState(false);
  const [recurrence, setRecurrence] = useState<Recurrence>('monthly');
  const [hasEndDate, setHasEndDate] = useState(false);
  const [recurrenceEnd, setRecurrenceEnd] = useState('');

  async function reload() {
    if (!workspaceId) return;
    const [ex, cust] = await Promise.all([getExpenses(workspaceId), getCustomers(workspaceId)]);
    setItems(ex);
    setCustomers(cust);
  }

  useEffect(() => {
    void reload();
  }, [workspaceId]);

  const sumMonth = useMemo(
    () => items.filter(e => e.date.slice(0, 7) === expenseMonth).reduce((s, e) => s + e.amount, 0),
    [items, expenseMonth]
  );

  async function submit() {
    const n = parseFloat(amount.replace(',', '.'));
    if (Number.isNaN(n) || n < 0 || !date) return;
    await addExpense(workspaceId, {
      amount: n,
      date,
      description: memo.trim(),
      is_recurring: recurring,
      recurrence: recurring ? recurrence : null,
      recurrence_end:
        recurring && hasEndDate && recurrenceEnd.trim() ? recurrenceEnd.trim() : recurring && !hasEndDate ? null : null,
      customer_id: customerId || null,
    });
    setModalOpen(false);
    setAmount('');
    setMemo('');
    setCustomerId('');
    setRecurring(false);
    setRecurrence('monthly');
    setHasEndDate(false);
    setRecurrenceEnd('');
    await reload();
  }

  function recurrenceLabel(r: Recurrence): string {
    if (r === 'daily') return t('recurrenceDaily');
    if (r === 'weekly') return t('recurrenceWeekly');
    if (r === 'monthly') return t('recurrenceMonthly');
    return t('recurrenceYearly');
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>
            {t('expensesHeading')}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{t('expensesIntro')}</p>
        </div>
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '10px 16px',
            borderRadius: '10px',
            border: 'none',
            background: 'var(--accent)',
            color: '#fff',
            fontWeight: 600,
            fontSize: '0.875rem',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-sm)',
          }}
          aria-label={t('fabAddExpense')}
        >
          <span style={{ fontSize: '1.25rem', lineHeight: 1 }}>+</span>
          {t('fabAddExpense')}
        </button>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
          {t('expensesSelectMonth')}
        </label>
        <input type="month" value={expenseMonth} onChange={e => setExpenseMonth(e.target.value)} style={{ maxWidth: '220px' }} />
        <div className="stat-card" style={{ marginTop: '16px', textAlign: 'left' }}>
          <div
            style={{
              fontSize: '0.75rem',
              color: 'var(--text-secondary)',
              marginBottom: '6px',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            {t('expensesSumMonth')}
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 700 }}>{eurFmt.format(sumMonth)}</div>
        </div>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '0.9375rem', fontWeight: 600, marginBottom: '12px', color: 'var(--text-primary)' }}>
          {t('expensesListHeading')}
        </h3>
        {items.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('expensesEmpty')}</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {[...items]
              .sort((a, b) => b.date.localeCompare(a.date) || b.created_at.localeCompare(a.created_at))
              .map(ex => (
                <li
                  key={ex.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '12px',
                    padding: '12px 14px',
                    background: 'var(--bg-inner)',
                    borderRadius: '8px',
                    border: '1px solid var(--border-color)',
                  }}
                >
                  <div style={{ minWidth: 0 }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{eurFmt.format(ex.amount)}</div>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                      {new Date(`${ex.date}T12:00:00`).toLocaleDateString(locale, {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                      {ex.description ? ` · ${ex.description}` : ''}
                    </div>
                    {ex.is_recurring && ex.recurrence && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--accent)', marginTop: '4px' }}>
                        ↻ {recurrenceLabel(ex.recurrence)}
                        {ex.recurrence_end ? ` · ${t('recurrenceEndLabel')}: ${ex.recurrence_end}` : ` · ${t('recurrenceNoEnd')}`}
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={async () => {
                      await deleteExpense(workspaceId, ex.id);
                      await reload();
                    }}
                    style={{
                      flexShrink: 0,
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: 'none',
                      fontSize: '0.75rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      background: 'var(--danger-soft)',
                      color: 'var(--danger)',
                    }}
                  >
                    {t('delete')}
                  </button>
                </li>
              ))}
          </ul>
        )}
      </div>

      {modalOpen && (
        <div
          role="dialog"
          aria-modal="true"
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
          <div
            className="card"
            style={{ maxWidth: '420px', width: '100%', padding: '22px' }}
            onClick={e => e.stopPropagation()}
          >
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
              {t('expenseModalTitle')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {t('expenseAmountLabel')}
                </label>
                <input type="text" inputMode="decimal" value={amount} onChange={e => setAmount(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {t('date')}
                </label>
                <input type="date" value={date} onChange={e => setDate(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {t('expenseDescriptionLabel')}
                </label>
                <input type="text" value={memo} onChange={e => setMemo(e.target.value)} style={{ width: '100%' }} />
              </div>
              {customers.length > 0 && (
                <div>
                  <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                    {t('quotePickCustomer')}
                  </label>
                  <select value={customerId} onChange={e => setCustomerId(e.target.value)} style={{ width: '100%' }}>
                    <option value="">—</option>
                    {customers.map(c => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                <input type="checkbox" checked={recurring} onChange={e => setRecurring(e.target.checked)} />
                {t('expenseRecurringLabel')}
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
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer', fontSize: '0.875rem' }}>
                    <input type="checkbox" checked={hasEndDate} onChange={e => setHasEndDate(e.target.checked)} />
                    {t('recurrenceEndLabel')}
                  </label>
                  {hasEndDate && <input type="date" value={recurrenceEnd} onChange={e => setRecurrenceEnd(e.target.value)} style={{ width: '100%' }} />}
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
                  color: 'var(--text-primary)',
                  fontWeight: 500,
                  cursor: 'pointer',
                }}
              >
                {t('cancel')}
              </button>
              <button
                type="button"
                onClick={() => void submit()}
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
                {t('expenseAddButton')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
