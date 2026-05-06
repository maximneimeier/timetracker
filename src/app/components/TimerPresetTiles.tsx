'use client';

import type { TranslationKey } from '../lib/i18n';
import { TIMER_PRESET_IDS, type TimerPresetId } from '../lib/timerPreset';

function MiniTimerPreview({
  preset,
  subTheme,
  sampleLabel,
}: {
  preset: TimerPresetId;
  subTheme: 'dark' | 'light';
  sampleLabel: string;
}) {
  return (
    <div className="timer-preview-scope timer-preview-cell" data-theme={subTheme}>
      <div className={`card timer-shell timer-shell--${preset} timer-preview-mini`}>
        <p style={{ fontSize: '0.5625rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
          {sampleLabel}
        </p>
        <div className="timer-shell-display" style={{ fontWeight: 700, color: 'var(--accent)', lineHeight: 1 }}>
          01:23:45
        </div>
        <div
          aria-hidden
          style={{
            marginTop: '6px',
            width: '100%',
            padding: '4px',
            borderRadius: '6px',
            border: 'none',
            background: 'var(--danger)',
            color: '#ffffff',
            fontSize: '0.5625rem',
            fontWeight: 600,
            cursor: 'default',
            opacity: 0.9,
            textAlign: 'center',
            boxSizing: 'border-box',
          }}
        >
          ●
        </div>
      </div>
    </div>
  );
}

const presetTranslationKey: Record<TimerPresetId, TranslationKey> = {
  classic: 'timerPresetClassic',
  minimal: 'timerPresetMinimal',
  glow: 'timerPresetGlow',
  ring: 'timerPresetRing',
  mono: 'timerPresetMono',
  soft: 'timerPresetSoft',
};

export function TimerPresetTiles({
  value,
  onChange,
  t,
}: {
  value: TimerPresetId;
  onChange: (id: TimerPresetId) => void;
  t: (key: TranslationKey) => string;
}) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(164px, 1fr))',
        gap: '12px',
      }}
    >
      {TIMER_PRESET_IDS.map(id => {
        const active = value === id;
        return (
          <button
            key={id}
            type="button"
            onClick={() => onChange(id)}
            style={{
              display: 'block',
              textAlign: 'left',
              padding: '12px',
              borderRadius: '10px',
              border: active ? '2px solid var(--accent)' : '1px solid var(--border-color)',
              background: active ? 'var(--accent-soft)' : 'var(--bg-card)',
              cursor: 'pointer',
              transition: 'border-color 0.15s ease, background 0.15s ease',
            }}
          >
            <span
              style={{
                fontSize: '0.8125rem',
                fontWeight: active ? 700 : 600,
                color: 'var(--text-primary)',
              }}
            >
              {t(presetTranslationKey[id])}
            </span>
            <div className="timer-preview-pair">
              <div>
                <div
                  style={{
                    fontSize: '0.5625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                    marginBottom: '4px',
                  }}
                >
                  {t('settingsPreviewDark')}
                </div>
                <MiniTimerPreview preset={id} subTheme="dark" sampleLabel={t('settingsTimerSampleRunning')} />
              </div>
              <div>
                <div
                  style={{
                    fontSize: '0.5625rem',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    color: 'var(--text-muted)',
                    marginBottom: '4px',
                  }}
                >
                  {t('settingsPreviewLight')}
                </div>
                <MiniTimerPreview preset={id} subTheme="light" sampleLabel={t('settingsTimerSampleRunning')} />
              </div>
            </div>
          </button>
        );
      })}
    </div>
  );
}
