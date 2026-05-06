'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { getWorkspaceSettings, updateWorkspaceSettings } from '../../../../lib/storage';
import { TimerPresetTiles } from '../../../../components/TimerPresetTiles';
import type { TimerPresetId } from '../../../../lib/timerPreset';
import { useI18n } from '../../../../lib/i18n';

export default function WorkspaceAppearanceSettingsClient() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = String(params?.workspaceId ?? '');
  const { t } = useI18n();
  const [preset, setPreset] = useState<TimerPresetId>('classic');
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (workspaceId === '__') {
      router.replace('/dashboard');
      return;
    }
    let c = false;
    void (async () => {
      const s = await getWorkspaceSettings(workspaceId);
      if (!c) setPreset(s.timer_preset);
    })();
    return () => {
      c = true;
    };
  }, [workspaceId, router]);

  const saveApp = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    await updateWorkspaceSettings(workspaceId, { timer_preset: preset });
    setMessage(t('settingsAppSaved'));
  };

  const cardStyle: React.CSSProperties = {
    background: 'var(--bg-card)',
    border: '1px solid var(--border-color)',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '20px',
  };

  return (
    <div style={{ minHeight: '100vh', paddingBottom: '48px' }}>
      <header className="linear-nav-shell">
        <div style={{ maxWidth: '560px', margin: '0 auto', padding: '14px 20px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginBottom: '8px' }}>
            <Link href={`/dashboard/w/${workspaceId}`} style={{ color: 'var(--accent)', fontSize: '0.875rem', textDecoration: 'none' }}>
              ← {t('settingsBackToDashboard')}
            </Link>
            <Link href="/dashboard" style={{ color: 'var(--accent)', fontSize: '0.875rem', textDecoration: 'none' }}>
              {t('workspaceBackToList')}
            </Link>
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '10px', color: 'var(--text-primary)' }}>
            {t('workspaceSettingsTitle')}
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginTop: '4px' }}>{t('settingsTimerHelp')}</p>
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
              border: '1px solid rgba(76,183,130,0.35)',
              background: 'var(--success-soft)',
              color: 'var(--success)',
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={saveApp}>
          <section style={cardStyle}>
            <TimerPresetTiles value={preset} onChange={setPreset} t={t} />
          </section>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              background: 'var(--success)',
              color: '#ffffff',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {t('settingsSaveApp')}
          </button>
        </form>

        <p style={{ marginTop: '28px', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
          <Link href="/dashboard/settings" style={{ color: 'var(--accent)' }}>
            {t('einstellungen')}
          </Link>
          {' — '}
          {t('workspaceSettingsFooterAccountSuffix')}
        </p>
      </main>
    </div>
  );
}
