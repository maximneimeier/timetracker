'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { supabase } from '../lib/supabase';
import { useI18n } from '../lib/i18n';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useI18n();

  const needsAccount = Boolean(supabase);

  useEffect(() => {
    if (!needsAccount || loading) return;
    if (!user) {
      router.replace(`/login?next=${encodeURIComponent('/dashboard')}`);
    }
  }, [needsAccount, loading, user, router]);

  if (!needsAccount) {
    return <>{children}</>;
  }

  if (loading || !user) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'var(--bg-page)',
        }}
      >
        <div style={{ color: 'var(--text-secondary)' }}>{t('loading')}</div>
      </div>
    );
  }

  return <>{children}</>;
}
