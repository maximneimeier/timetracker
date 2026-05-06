'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Press_Start_2P } from 'next/font/google';
import { useTheme } from '../lib/theme';
import { useI18n, type Language } from '../lib/i18n';
import {
  listWorkspaces,
  createWorkspace,
  type Workspace,
  type WorkspaceKind,
} from '../lib/storage';

const pixelClockFont = Press_Start_2P({
  weight: '400',
  subsets: ['latin'],
  display: 'swap',
});

function localeForLang(lang: Language): string {
  if (lang === 'de') return 'de-DE';
  if (lang === 'en') return 'en-US';
  if (lang === 'es') return 'es-ES';
  if (lang === 'fr') return 'fr-FR';
  return 'ru-RU';
}

function PixelDigitalClock() {
  const { t, lang } = useI18n();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  const blink = now.getSeconds() % 2 === 0;
  const sep = blink ? ':' : ' ';

  const dateLine = now.toLocaleDateString(localeForLang(lang), {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="workspace-picker-pixel-clock">
      <time
        dateTime={now.toISOString()}
        aria-label={t('workspacePickerClockAria')}
        className={`workspace-picker-pixel-clock__time ${pixelClockFont.className}`}
      >
        {h}
        {sep}
        {m}
        {sep}
        {s}
      </time>
      <p className="workspace-picker-pixel-clock__date">{dateLine}</p>
    </div>
  );
}

function PlusIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

function BriefcaseIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

export default function DashboardWorkspacePickerPage() {
  const { theme, toggleTheme } = useTheme();
  const { t } = useI18n();
  const [workspaces, setWorkspaces] = useState<Workspace[]>([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [newName, setNewName] = useState('');
  const [newKind, setNewKind] = useState<WorkspaceKind>('solo');
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    let c = true;
    void (async () => {
      const w = await listWorkspaces();
      if (c) setWorkspaces(w);
    })();
    return () => {
      c = false;
    };
  }, []);

  async function submitCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!newName.trim() || busy) return;
    setBusy(true);
    try {
      await createWorkspace(newName.trim(), newKind);
      setModalOpen(false);
      setNewName('');
      const w = await listWorkspaces();
      setWorkspaces(w);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '48px' }}>
      <header className="linear-nav-shell">
        <div
          style={{
            maxWidth: '960px',
            margin: '0 auto',
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div>
            <h1 style={{ fontWeight: 700, color: 'var(--text-primary)', margin: 0, fontSize: '1.25rem' }}>
              {t('workspacePickTitle')}
            </h1>
            <p style={{ margin: '6px 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
              {t('workspacePickLead')}
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Link
              href="/dashboard/settings"
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontSize: '0.875rem',
                fontWeight: 500,
              }}
            >
              {t('einstellungen')}
            </Link>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? t('lightMode') : t('darkMode')}
              style={{
                padding: '10px 14px',
                borderRadius: '8px',
                border: '1px solid var(--border-color)',
                background: 'var(--bg-card)',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
              }}
            >
              {theme === 'dark' ? '☀' : '☾'}
            </button>
          </div>
        </div>
      </header>

      <main style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 20px 40px' }}>
        <PixelDigitalClock />
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(168px, 1fr))',
            gap: '16px',
          }}
        >
          {workspaces.map(ws => (
            <Link
              key={ws.id}
              href={`/dashboard/w/${ws.id}`}
              className="card"
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
                justifyContent: 'space-between',
                minHeight: '132px',
                padding: '18px',
                borderRadius: '14px',
                border: '1px solid var(--border-color)',
                textDecoration: 'none',
                color: 'inherit',
                background: 'var(--bg-card)',
                transition: 'border-color 0.15s ease, box-shadow 0.15s ease',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px', marginBottom: '12px' }}>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    borderRadius: '10px',
                    background: ws.kind === 'company' ? 'var(--accent-soft)' : 'var(--bg-inner)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'var(--accent)',
                    flexShrink: 0,
                  }}
                >
                  <BriefcaseIcon className="w-5 h-5" />
                </div>
                <div style={{ minWidth: 0 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: 'var(--text-primary)',
                      lineHeight: 1.3,
                      wordBreak: 'break-word',
                    }}
                  >
                    {ws.name}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '6px', textTransform: 'uppercase' }}>
                    {ws.kind === 'company' ? t('workspaceKindCompany') : t('workspaceKindSolo')}
                  </div>
                </div>
              </div>
              <span
                style={{
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  color: 'var(--accent)',
                }}
              >
                {t('workspaceOpen')} →
              </span>
            </Link>
          ))}

          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="card"
            style={{
              minHeight: '132px',
              padding: '18px',
              borderRadius: '14px',
              border: '2px dashed var(--border-color)',
              background: 'transparent',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              color: 'var(--accent)',
            }}
          >
            <PlusIcon className="w-8 h-8" />
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{t('workspaceNew')}</span>
          </button>
        </div>
      </main>

      {modalOpen && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.55)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px',
          }}
          onClick={() => !busy && setModalOpen(false)}
        >
          <form
            onSubmit={submitCreate}
            style={{
              background: 'var(--bg-card)',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              padding: '24px',
              maxWidth: '400px',
              width: '100%',
            }}
            onClick={e => e.stopPropagation()}
          >
            <h2 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
              {t('workspaceNew')}
            </h2>
            <div style={{ marginBottom: '14px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {t('workspaceNameLabel')}
              </label>
              <input
                autoFocus
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder={t('workspaceNamePlaceholder')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                }}
              />
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={{ display: 'block', fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '6px' }}>
                {t('workspaceKindLabel')}
              </label>
              <select
                value={newKind}
                onChange={e => setNewKind(e.target.value === 'company' ? 'company' : 'solo')}
                style={{
                  width: '100%',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                }}
              >
                <option value="solo">{t('workspaceKindSolo')}</option>
                <option value="company">{t('workspaceKindCompany')}</option>
              </select>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px', lineHeight: 1.45 }}>
                {newKind === 'solo' ? t('workspaceHintSolo') : t('workspaceHintCompany')}
              </p>
            </div>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '20px' }}>
              <button
                type="button"
                disabled={busy}
                onClick={() => setModalOpen(false)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-input)',
                  cursor: busy ? 'not-allowed' : 'pointer',
                }}
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={!newName.trim() || busy}
                style={{
                  padding: '10px 16px',
                  borderRadius: '8px',
                  border: 'none',
                  background: newName.trim() ? 'var(--accent)' : 'var(--text-disabled)',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: newName.trim() && !busy ? 'pointer' : 'not-allowed',
                }}
              >
                {t('workspaceCreateConfirm')}
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
