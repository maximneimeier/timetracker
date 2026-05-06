'use client';

import { useState, useEffect } from 'react';
import type { TranslationKey } from '../../lib/i18n';
import { getCustomers, addCustomer, deleteCustomer, type Customer } from '../../lib/storage';

export function CustomersSection({
  workspaceId,
  t,
}: {
  workspaceId: string;
  t: (key: TranslationKey) => string;
}) {
  const [list, setList] = useState<Customer[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [company, setCompany] = useState('');
  const [notes, setNotes] = useState('');

  async function reload() {
    setList(await getCustomers(workspaceId));
  }

  useEffect(() => {
    void reload();
  }, [workspaceId]);

  async function submit() {
    const n = name.trim();
    if (!n) return;
    await addCustomer(workspaceId, { name: n, email, phone, company, notes });
    setModalOpen(false);
    setName('');
    setEmail('');
    setPhone('');
    setCompany('');
    setNotes('');
    await reload();
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <h2 style={{ fontSize: '1.125rem', fontWeight: 600, marginBottom: '4px', color: 'var(--text-primary)' }}>
            {t('crmCustomersTitle')}
          </h2>
          <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', margin: 0 }}>{t('crmCustomersLead')}</p>
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
            cursor: 'pointer',
          }}
        >
          + {t('crmAddCustomer')}
        </button>
      </div>

      <div className="card" style={{ padding: '20px' }}>
        {list.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{t('crmEmptyCustomers')}</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {list.map(c => (
              <li
                key={c.id}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  justifyContent: 'space-between',
                  gap: '12px',
                  padding: '14px',
                  background: 'var(--bg-inner)',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                }}
              >
                <div style={{ minWidth: 0 }}>
                  <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{c.name}</div>
                  {[c.company, c.email, c.phone]
                    .filter(Boolean)
                    .map(line => (
                      <div key={line} style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                        {line}
                      </div>
                    ))}
                  {c.notes ? (
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '8px', fontStyle: 'italic' }}>
                      {c.notes}
                    </div>
                  ) : null}
                </div>
                <button
                  type="button"
                  onClick={async () => {
                    await deleteCustomer(workspaceId, c.id);
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
            <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '16px' }}>{t('crmCustomerModalTitle')}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {t('crmCustomerName')} *
                </label>
                <input value={name} onChange={e => setName(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {t('crmCustomerEmail')}
                </label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {t('crmCustomerPhone')}
                </label>
                <input value={phone} onChange={e => setPhone(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {t('crmCompany')}
                </label>
                <input value={company} onChange={e => setCompany(e.target.value)} style={{ width: '100%' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                  {t('crmNotes')}
                </label>
                <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3} style={{ width: '100%', resize: 'vertical' }} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button type="button" onClick={() => setModalOpen(false)} style={{
                flex: 1,
                padding: '11px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-inner)',
                cursor: 'pointer',
              }}>
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
                  background: 'var(--accent)',
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
