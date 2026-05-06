'use client';

import { useI18n } from '../../lib/i18n';

/** Pixel-artiger Produkt‑Teaser (leicht 3D gekippt) für den Hero-Bereich */
export function LandingShowcase() {
  const { t } = useI18n();

  return (
    <div className="landing-showcase-wrap" style={{ perspective: '840px', width: '100%', maxWidth: 400 }}>
      <div
        style={{
          transform: 'rotateY(-10deg) rotateX(8deg)',
          transformStyle: 'preserve-3d',
        }}
      >
        <div
          style={{
            padding: '3px',
            background: 'linear-gradient(135deg, var(--accent) 0%, #38bdf8 100%)',
            borderRadius: 6,
            boxShadow: 'var(--shadow-md)',
          }}
        >
          <div
            style={{
              background: 'var(--bg-card)',
              borderRadius: 4,
              padding: '20px 22px',
              border: '1px solid var(--border-color)',
              boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <span aria-hidden style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--danger)' }} />
              <span aria-hidden style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--warning)' }} />
              <span aria-hidden style={{ width: 8, height: 8, borderRadius: 2, background: 'var(--success)' }} />
              <span
                style={{
                  marginLeft: 6,
                  fontSize: 10,
                  fontFamily: 'var(--font-mono-linear), monospace',
                  color: 'var(--text-muted)',
                  letterSpacing: '0.06em',
                }}
              >
                timetracker
              </span>
            </div>
            <p
              style={{
                margin: '0 0 12px',
                fontSize: 10,
                color: 'var(--accent)',
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                fontWeight: 600,
              }}
            >
              {t('liveTimer')}
            </p>
            <div
              className="landing-digit-row"
              style={{
                fontFamily: 'var(--font-mono-linear), monospace',
                fontSize: 'clamp(1.85rem, 5vw, 2.65rem)',
                fontWeight: 700,
                letterSpacing: '-0.02em',
                color: 'var(--text-primary)',
                marginBottom: 18,
              }}
              aria-hidden
            >
              02:47:03
            </div>
            <div style={{ display: 'flex', gap: 6, marginBottom: 14, flexDirection: 'column' }}>
              <div className="landing-pixel-bar landing-pixel-bar-a" />
              <div className="landing-pixel-bar landing-pixel-bar-b" />
              <div className="landing-pixel-bar landing-pixel-bar-c" />
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', margin: 0, lineHeight: 1.5 }}>
              {t('appSubtitle')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
