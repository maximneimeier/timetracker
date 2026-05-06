'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import WorkspaceDashboardPage from '../../../components/workspace/WorkspaceDashboardPage';
import { getWorkspaceById, getMyRoleInWorkspace } from '../../../lib/storage';
import { useI18n } from '../../../lib/i18n';

export default function WorkspaceRoutePageClient() {
  const params = useParams();
  const router = useRouter();
  const workspaceId = String(params?.workspaceId ?? '');
  const { t } = useI18n();
  const [phase, setPhase] = useState<'loading' | 'ready' | 'missing'>('loading');
  const [employeeMode, setEmployeeMode] = useState(false);

  useEffect(() => {
    if (workspaceId === '__') {
      router.replace('/dashboard');
      return;
    }
    let cancelled = false;
    void (async () => {
      if (!workspaceId) {
        setPhase('missing');
        return;
      }
      const ws = await getWorkspaceById(workspaceId);
      if (cancelled) return;
      if (!ws) {
        setPhase('missing');
        return;
      }
      const role = await getMyRoleInWorkspace(workspaceId);
      if (cancelled) return;
      const emp = ws.kind === 'company' && role === 'member';
      setEmployeeMode(emp);
      setPhase('ready');
    })();
    return () => {
      cancelled = true;
    };
  }, [workspaceId, router]);

  if (!workspaceId) return null;

  if (phase === 'loading') {
    return (
      <div style={{ padding: '48px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        {t('loading')}
      </div>
    );
  }

  if (phase === 'missing') {
    return (
      <div style={{ padding: 48, maxWidth: 520, margin: '0 auto' }}>
        <p style={{ color: 'var(--text-secondary)', marginBottom: 16 }}>{t('workspaceNotFound')}</p>
        <Link href="/dashboard" style={{ color: 'var(--accent)', fontWeight: 600 }}>
          {t('workspaceBackToList')}
        </Link>
      </div>
    );
  }

  return <WorkspaceDashboardPage workspaceId={workspaceId} employeeMode={employeeMode} />;
}
