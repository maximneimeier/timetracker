'use client';

import type React from 'react';
import Link from 'next/link';
import { useTheme } from './lib/theme';
import { useI18n } from './lib/i18n';
import { useAuth } from './lib/AuthContext';
import { supabase } from './lib/supabase';
import { PixelBackdrop } from './components/landing/PixelBackdrop';
import { LandingShowcase } from './components/landing/LandingShowcase';

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
        background: 'linear-gradient(135deg, var(--accent) 0%, #38bdf8 100%)',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 10px var(--accent-soft)',
        imageRendering: 'pixelated',
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
    <div
      className="landing-shell landing-shell-fallback"
      style={{
        /* harte Fallbacks gegen weiße/flackernde Seite vor CSS-Theme */
        backgroundColor: 'var(--bg-page, #08090a)',
        color: 'var(--text-primary, #f7f8f8)',
      }}
    >
      <PixelBackdrop />
      <div className="landing-vignette" aria-hidden />

      <div className="landing-content">
        <header className="linear-nav-shell">
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              maxWidth: 1120,
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

        <main style={{ maxWidth: 1120, margin: '0 auto', padding: '48px 24px 80px' }}>
          {/* Hero */}
          <section
            style={{
              display: 'grid',
              gap: '40px 32px',
              alignItems: 'center',
              marginBottom: 56,
              gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 320px), 1fr))',
            }}
          >
            <div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 18 }}>
                <span className="landing-stat-pill">{t('landingKicker')}</span>
              </div>
              <h1
                style={{
                  fontSize: 'clamp(2.1rem, 5vw, 3.35rem)',
                  fontWeight: 600,
                  lineHeight: 1.06,
                  marginBottom: 20,
                  letterSpacing: '-0.038em',
                }}
              >
                {t('landingHeadline')}
              </h1>
              <p
                style={{
                  fontSize: '1.05rem',
                  color: 'var(--text-secondary)',
                  lineHeight: 1.65,
                  marginBottom: 28,
                  maxWidth: 520,
                }}
              >
                {t('landingLead')}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16 }}>
                {cloudMode && !loading && !user ? (
                  <>
                    <Link href="/signup" className="linear-btn-primary" style={{ padding: '10px 18px', fontSize: '0.8125rem' }}>
                      {t('landingCtaSignup')}
                    </Link>
                    <Link href="/login" className="linear-btn-outline" style={{ padding: '10px 18px', fontSize: '0.8125rem' }}>
                      {t('landingCtaLogin')}
                    </Link>
                  </>
                ) : null}
                {showAppCta ? (
                  <Link
                    href="/dashboard"
                    className={user && cloudMode ? 'linear-btn-primary' : 'linear-btn-outline'}
                    style={{ padding: '10px 18px', fontSize: '0.8125rem' }}
                  >
                    {t('landingToApp')}
                  </Link>
                ) : null}
              </div>
              {!cloudMode ? (
                <p style={{ fontSize: '0.8125rem', color: 'var(--warning)' }}>{t('landingNoSupabase')}</p>
              ) : null}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 26 }}>
                {[
                  { sym: '▪', label: t('timer') },
                  { sym: '▪', label: t('projects') },
                  { sym: '▪', label: t('auswertung') },
                ].map(({ sym, label }, idx) => (
                  <span key={idx} className="landing-stat-pill" style={{ fontFamily: 'var(--font-mono-linear), monospace' }}>
                    <span style={{ color: 'var(--accent)', fontSize: 11 }}>{sym}</span>
                    {label}
                  </span>
                ))}
              </div>
            </div>
            <LandingShowcase />
          </section>

          {/* Feature-Karten */}
          <section style={{ marginBottom: 48 }}>
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: 0,
                display: 'grid',
                gap: 14,
                gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              }}
            >
              {[t('landingFeat1'), t('landingFeat2'), t('landingFeat3')].map((text, i) => (
                <li
                  key={i}
                  className="card"
                  style={{
                    padding: '22px',
                    fontSize: '0.8125rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                  }}
                >
                  <div
                    aria-hidden
                    style={{
                      width: 10,
                      height: 10,
                      background: 'var(--accent)',
                      borderRadius: 2,
                      marginBottom: 12,
                      imageRendering: 'pixelated',
                      boxShadow: '0 0 0 2px color-mix(in srgb, var(--accent) 35%, transparent)',
                    }}
                  />
                  {text}
                </li>
              ))}
            </ul>
          </section>

          {/* CTA-Band */}
          <section className="landing-cta-band">
            <div style={{ flex: '1 1 220px' }}>
              <strong style={{ display: 'block', fontSize: '1rem', marginBottom: 6, fontWeight: 600 }}>{t('appTitle')}</strong>
              <span style={{ fontSize: '0.8125rem', color: 'var(--text-secondary)' }}>{t('appSubtitle')}</span>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {cloudMode && !loading && !user ? (
                <>
                  <Link href="/signup" className="linear-btn-primary">
                    {t('signUp')}
                  </Link>
                  <Link href="/login" className="linear-btn-outline">
                    {t('login')}
                  </Link>
                </>
              ) : (
                showAppCta && (
                  <Link href="/dashboard" className="linear-btn-primary">
                    {t('landingToApp')}
                  </Link>
                )
              )}
            </div>
          </section>
        </main>

        <footer
          style={{
            borderTop: '1px solid var(--border-color)',
            padding: '26px 24px',
            textAlign: 'center',
            fontSize: '0.75rem',
            color: 'var(--text-muted)',
          }}
        >
          {t('landingFooter')}
        </footer>
      </div>
    </div>
  );
}
