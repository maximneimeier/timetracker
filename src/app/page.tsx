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

export default function LandingPage() {
  const { theme, toggleTheme } = useTheme();
  const { t, lang, setLang } = useI18n();
  const { user, loading } = useAuth();
  const cloudMode = Boolean(supabase);
  const showAppCta = !cloudMode || (!loading && Boolean(user));

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-page)', color: 'var(--text-primary)' }}>
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-color)',
          maxWidth: 1100,
          margin: '0 auto',
        }}
      >
        <Link
          href="/"
          style={{
            fontWeight: 700,
            fontSize: '1.125rem',
            color: 'var(--text-primary)',
            textDecoration: 'none',
            letterSpacing: '-0.02em',
          }}
        >
          {t('appTitle')}
        </Link>
        <nav style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value as typeof lang)}
            aria-label={t('language')}
            style={{ padding: '8px 10px', fontSize: '0.8125rem', maxWidth: 120 }}
          >
            <option value="de">DE</option>
            <option value="en">EN</option>
            <option value="es">ES</option>
            <option value="fr">FR</option>
            <option value="ru">RU</option>
          </select>
          <button
            type="button"
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: 40,
              height: 40,
              borderRadius: 10,
              border: '1px solid var(--border-color)',
              background: 'var(--bg-inner)',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
            }}
            title={theme === 'dark' ? t('hell') : t('dunkel')}
          >
            {theme === 'dark' ? <SunIcon style={{ width: 20, height: 20 }} /> : <MoonIcon style={{ width: 20, height: 20 }} />}
          </button>
          {showAppCta ? (
            <Link
              href="/dashboard"
              style={{
                padding: '10px 18px',
                borderRadius: 10,
                background: 'var(--accent-soft)',
                color: 'var(--accent)',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              {t('landingToApp')}
            </Link>
          ) : null}
          {!user && cloudMode ? (
            <Link
              href="/login"
              style={{
                padding: '10px 16px',
                borderRadius: 10,
                color: 'var(--text-secondary)',
                textDecoration: 'none',
                fontWeight: 500,
                fontSize: '0.875rem',
              }}
            >
              {t('login')}
            </Link>
          ) : null}
          {!user && cloudMode ? (
            <Link
              href="/signup"
              style={{
                padding: '10px 18px',
                borderRadius: 10,
                background: 'var(--accent)',
                color: '#fff',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.875rem',
              }}
            >
              {t('signUp')}
            </Link>
          ) : null}
        </nav>
      </header>

      <main style={{ maxWidth: 920, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div
          style={{
            marginBottom: 40,
            padding: '32px',
            borderRadius: 16,
            border: '1px solid var(--border-color)',
            background: 'linear-gradient(145deg, var(--accent-soft) 0%, transparent 55%)',
          }}
        >
          <p
            style={{
              fontSize: '0.75rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: 12,
            }}
          >
            {t('landingKicker')}
          </p>
          <h1
            style={{
              fontSize: 'clamp(1.85rem, 4vw, 2.75rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              marginBottom: 16,
              letterSpacing: '-0.03em',
            }}
          >
            {t('landingHeadline')}
          </h1>
          <p
            style={{
              fontSize: '1.05rem',
              color: 'var(--text-secondary)',
              lineHeight: 1.65,
              maxWidth: 640,
              marginBottom: 28,
            }}
          >
            {t('landingLead')}
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            {cloudMode && !loading && !user ? (
              <>
                <Link
                  href="/signup"
                  style={{
                    padding: '14px 24px',
                    borderRadius: 12,
                    background: 'var(--accent)',
                    color: '#fff',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  {t('landingCtaSignup')}
                </Link>
                <Link
                  href="/login"
                  style={{
                    padding: '14px 24px',
                    borderRadius: 12,
                    border: '1px solid var(--border-color)',
                    color: 'var(--text-primary)',
                    fontWeight: 600,
                    textDecoration: 'none',
                    background: 'var(--bg-card)',
                  }}
                >
                  {t('landingCtaLogin')}
                </Link>
              </>
            ) : null}
            {showAppCta ? (
              <Link
                href="/dashboard"
                style={{
                  padding: '14px 24px',
                  borderRadius: 12,
                  background: user && cloudMode ? 'var(--accent)' : 'var(--bg-card)',
                  color: user && cloudMode ? '#fff' : 'var(--text-primary)',
                  fontWeight: 600,
                  textDecoration: 'none',
                  border: user && cloudMode ? 'none' : '1px solid var(--border-color)',
                }}
              >
                {t('landingToApp')}
              </Link>
            ) : null}
          </div>
          {!cloudMode ? (
            <p style={{ marginTop: 16, fontSize: '0.875rem', color: 'var(--warning)' }}>
              {t('landingNoSupabase')}
            </p>
          ) : null}
        </div>

        <ul
          style={{
            listStyle: 'none',
            padding: 0,
            margin: 0,
            display: 'grid',
            gap: 16,
            gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          }}
        >
          {[t('landingFeat1'), t('landingFeat2'), t('landingFeat3')].map((text, i) => (
            <li key={i} className="card" style={{ padding: '22px', fontSize: '0.9375rem', lineHeight: 1.55, color: 'var(--text-secondary)' }}>
              {text}
            </li>
          ))}
        </ul>
      </main>

      <footer
        style={{
          borderTop: '1px solid var(--border-color)',
          padding: '24px',
          textAlign: 'center',
          fontSize: '0.8125rem',
          color: 'var(--text-muted)',
        }}
      >
        {t('landingFooter')}
      </footer>
    </div>
  );
}
