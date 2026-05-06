'use client';

import type React from 'react';
import Link from 'next/link';
import { useTheme } from './lib/theme';
import { useI18n } from './lib/i18n';
import { useAuth } from './lib/AuthContext';
import { supabase } from './lib/supabase';

function MoonIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg className={className} style={style} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}

function LogoMark() {
  return (
    <span
      aria-hidden
      style={{
        width: 22,
        height: 22,
        borderRadius: 5,
        background: 'linear-gradient(135deg, var(--accent) 0%, #9b72f2 100%)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 10px var(--accent-soft)',
      }}
    />
  );
}

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const { t, lang, setLang } = useI18n();
  const { user, loading } = useAuth();
  const cloudMode = Boolean(supabase);
  const showAppCta = !cloudMode || (!loading && Boolean(user));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <header className="linear-nav-shell">
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            maxWidth: 1040,
            margin: '0 auto',
            padding: '14px 24px',
          }}
        >
          <Link
            href="/"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontWeight: 600,
              fontSize: '0.9375rem',
              color: 'var(--text-primary)',
              textDecoration: 'none',
              letterSpacing: '-0.025em',
            }}
          >
            <LogoMark />
            {t('appTitle')}
          </Link>
          <nav style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value as typeof lang)}
              aria-label={t('language')}
              style={{ maxWidth: 100, fontSize: '0.8125rem' }}
            >
              <option value="de">DE</option>
              <option value="en">EN</option>
              <option value="es">ES</option>
              <option value="fr">FR</option>
              <option value="ru">RU</option>
            </select>
            <button
              type="button"
              className="linear-icon-btn"
              onClick={toggleTheme}
              title={theme === 'dark' ? t('hell') : t('dunkel')}
            >
              {theme === 'dark' ? <SunIcon style={{ width: 16, height: 16 }} /> : <MoonIcon style={{ width: 16, height: 16 }} />}
            </button>
            {showAppCta ? (
              <Link href="/dashboard" className="linear-btn-outline" style={{ padding: '7px 12px' }}>
                {t('landingToApp')}
              </Link>
            ) : null}
            {!user && cloudMode ? (
              <Link href="/login" className="linear-btn-secondary" style={{ padding: '7px 12px' }}>
                {t('login')}
              </Link>
            ) : null}
            {!user && cloudMode ? (
              <Link href="/signup" className="linear-btn-primary" style={{ padding: '7px 12px' }}>
                {t('signUp')}
              </Link>
            ) : null}
          </nav>
        </div>
      </header>

      <main style={{ maxWidth: 1040, margin: '0 auto', padding: '56px 24px 96px' }}>
        <div className="hero-linear-glow" style={{ marginBottom: 40, padding: '40px 36px', overflow: 'hidden' }}>
          <div className="hero-linear-grid" style={{ position: 'absolute', inset: 0, zIndex: 0 }} aria-hidden />
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p
              style={{
                fontSize: '0.6875rem',
                fontWeight: 600,
                letterSpacing: '0.09em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                marginBottom: 12,
              }}
            >
              {t('landingKicker')}
            </p>
            <h1
              style={{
                fontSize: 'clamp(2rem, 4.8vw, 3rem)',
                fontWeight: 600,
                lineHeight: 1.08,
                marginBottom: 18,
                letterSpacing: '-0.038em',
                maxWidth: 720,
              }}
            >
              {t('landingHeadline')}
            </h1>
            <p
              style={{
                fontSize: '1rem',
                color: 'var(--text-secondary)',
                lineHeight: 1.65,
                maxWidth: 560,
                marginBottom: 32,
                fontWeight: 400,
              }}
            >
              {t('landingLead')}
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {cloudMode && !loading && !user ? (
                <>
                  <Link href="/signup" className="linear-btn-primary" style={{ padding: '10px 16px', fontSize: '0.8125rem' }}>
                    {t('landingCtaSignup')}
                  </Link>
                  <Link href="/login" className="linear-btn-outline" style={{ padding: '10px 16px', fontSize: '0.8125rem' }}>
                    {t('landingCtaLogin')}
                  </Link>
                </>
              ) : null}
              {showAppCta ? (
                <Link
                  href="/dashboard"
                  className={user && cloudMode ? 'linear-btn-primary' : 'linear-btn-outline'}
                  style={{ padding: '10px 16px', fontSize: '0.8125rem' }}
                >
                  {t('landingToApp')}
                </Link>
              ) : null}
            </div>
            {!cloudMode ? (
              <p style={{ marginTop: 20, fontSize: '0.8125rem', color: 'var(--warning)' }}>{t('landingNoSupabase')}</p>
            ) : null}
          </div>
        </div>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gap: 12,
            gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          }}
        >
          {[t('landingFeat1'), t('landingFeat2'), t('landingFeat3')].map((text, i) => (
            <li
              key={i}
              className="card"
              style={{
                padding: '20px',
                fontSize: '0.8125rem',
                lineHeight: 1.6,
                color: 'var(--text-secondary)',
                fontWeight: 400,
              }}
            >
              {text}
            </li>
          ))}
        </ul>
      </main>

      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '28px 24px',
          textAlign: 'center',
          fontSize: '0.75rem',
          color: 'var(--text-muted)',
          letterSpacing: '0.01em',
        }}
      >
        {t('landingFooter')}
      </footer>
    </div>
  );
}
