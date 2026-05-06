'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '../../lib/supabase';
import { useAuth } from '../../lib/AuthContext';
import { useI18n, type Language } from '../../lib/i18n';
export default function DashboardSettingsPage() {
  const { user, updateProfile, updatePassword, signOut } = useAuth();
  const { t, lang, setLang } = useI18n();

  const cloud = Boolean(supabase);
  const loggedIn = Boolean(user);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [message, setMessage] = useState<{ type: 'ok' | 'err'; text: string } | null>(null);

  useEffect(() => {
    setMessage(null);
    if (!user) {
      setName('');
      setEmail('');
      return;
    }
    const meta = user.user_metadata as { name?: string; full_name?: string };
    setName((meta?.name ?? meta?.full_name ?? '').trim());
    setEmail(user.email ?? '');
  }, [user]);

  const saveAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!cloud || !loggedIn) return;
    const { error } = await updateProfile({ name: name.trim(), email: email.trim() });
    if (error) setMessage({ type: 'err', text: error.message });
    else setMessage({ type: 'ok', text: [t('profileSaved'), t('settingsEmailPending')].join(' ') });
  };

  const savePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    if (!cloud || !loggedIn) return;
    if (newPw.length < 6) {
      setMessage({ type: 'err', text: t('passwordTooShort') });
      return;
    }
    if (newPw !== confirmPw) {
      setMessage({ type: 'err', text: t('passwordsDoNotMatch') });
      return;
    }
    const { error } = await updatePassword(newPw);
    if (error) setMessage({ type: 'err', text: error.message });
    else {
      setMessage({ type: 'ok', text: t('passwordUpdated') });
      setNewPw('');
      setConfirmPw('');
    }
  };

  const fieldStyle = { width: '100%' as const };

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '0.8125rem',
    color: 'var(--text-secondary)',
    marginBottom: '6px',
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '48px' }}>
      <header className="linear-nav-shell">
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '14px 20px' }}>
          <Link href="/dashboard" style={{ color: 'var(--accent)', fontSize: '0.875rem', textDecoration: 'none' }}>
            {t('settingsBackToDashboard')}
          </Link>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '10px', color: 'var(--text-primary)' }}>
            {t('settingsPageTitle')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>
            {t('settingsPageLead')}
          </p>
        </div>
      </header>

      <main style={{ maxWidth: '560px', margin: '0 auto', padding: '28px 20px 0' }}>
        {message && (
          <div
            style={{
              borderRadius: '10px',
              padding: '12px 14px',
              marginBottom: '20px',
              fontSize: '0.875rem',
              border:
                message.type === 'err' ? '1px solid rgba(235,87,87,0.35)' : '1px solid rgba(76,183,130,0.35)',
              background: message.type === 'err' ? 'var(--danger-soft)' : 'var(--success-soft)',
              color: message.type === 'err' ? 'var(--danger)' : 'var(--success)',
            }}
          >
            {message.text}
          </div>
        )}

        {/* Konto */}
        <section style={cardStyle}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
            {t('settingsAccountSection')}
          </h2>
          {!cloud || !loggedIn ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('settingsCloudOnly')}</p>
          ) : (
            <form onSubmit={saveAccount}>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>{t('settingsFullName')}</label>
                <input style={fieldStyle} value={name} onChange={e => setName(e.target.value)} autoComplete="name" />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>{t('settingsEmail')}</label>
                <input style={fieldStyle} type="email" value={email} onChange={e => setEmail(e.target.value)} />
              </div>
              <button
                type="submit"
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {t('settingsSaveAccount')}
              </button>
            </form>
          )}
        </section>

        {/* Passwort */}
        <section style={cardStyle}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '16px', color: 'var(--text-primary)' }}>
            {t('settingsPasswordSection')}
          </h2>
          {!cloud || !loggedIn ? (
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>{t('settingsCloudOnly')}</p>
          ) : (
            <form onSubmit={savePassword}>
              <div style={{ marginBottom: '14px' }}>
                <label style={labelStyle}>{t('settingsNewPassword')}</label>
                <input
                  style={fieldStyle}
                  type="password"
                  value={newPw}
                  onChange={e => setNewPw(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={labelStyle}>{t('settingsConfirmPassword')}</label>
                <input
                  style={fieldStyle}
                  type="password"
                  value={confirmPw}
                  onChange={e => setConfirmPw(e.target.value)}
                  autoComplete="new-password"
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: '10px 18px',
                  borderRadius: '8px',
                  border: 'none',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {t('settingsChangePassword')}
              </button>
            </form>
          )}
        </section>

        <section style={cardStyle}>
          <h2 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '14px', color: 'var(--text-primary)' }}>
            {t('settingsWorkspaceSection')}
          </h2>
          <p style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)', marginBottom: '14px', lineHeight: 1.45 }}>
            {t('settingsTimerWorkspaceHint')}
          </p>
          <div style={{ marginBottom: '8px' }}>
            <label style={labelStyle}>{t('language')}</label>
            <select style={fieldStyle} value={lang} onChange={e => setLang(e.target.value as Language)}>
              <option value="de">DE — Deutsch</option>
              <option value="en">EN — English</option>
              <option value="es">ES — Español</option>
              <option value="fr">FR — Français</option>
              <option value="ru">RU — Русский</option>
            </select>
          </div>
        </section>

        {loggedIn && cloud && (
          <button
            type="button"
            onClick={() => signOut()}
            style={{
              width: '100%',
              marginTop: '20px',
              padding: '12px',
              borderRadius: '10px',
              border: '1px solid var(--border-color)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {t('logout')}
          </button>
        )}
      </main>
    </div>
  );
}
