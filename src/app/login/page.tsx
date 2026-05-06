'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { useI18n } from '../lib/i18n';
import Link from 'next/link';
import { getSafeNextPath } from '../lib/navigation';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get('next'));

  const { user, signIn, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      router.push(nextPath);
    }
  }, [user, authLoading, router, nextPath]);

  if (authLoading || user) {
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email || !password) {
      setError(t('fillAllFields'));
      setLoading(false);
      return;
    }

    const { error } = await signIn(email, password);
    if (error) {
      setError(t('loginError'));
      setLoading(false);
    } else {
      setSuccess(t('loginSuccess'));
      router.push(nextPath);
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-page)',
        padding: '20px',
      }}
    >
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
        <h1
          style={{
            fontSize: '1.5rem',
            fontWeight: 600,
            marginBottom: '8px',
            color: 'var(--text-primary)',
          }}
        >
          {t('loginTitle')}
        </h1>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginBottom: '24px',
          }}
        >
          {t('loginSubtitle')}
        </p>

        {error && (
          <div
            style={{
              background: 'var(--danger-soft)',
              color: 'var(--danger)',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '16px',
              fontSize: '0.875rem',
            }}
          >
            {error}
          </div>
        )}

        {success && (
          <div
            style={{
              background: 'var(--success-soft)',
              color: 'var(--success)',
              padding: '12px 16px',
              borderRadius: '10px',
              marginBottom: '16px',
              fontSize: '0.875rem',
            }}
          >
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: '6px',
              }}
            >
              {t('email')}
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t('emailPlaceholder')}
              style={{ width: '100%' }}
              disabled={loading}
            />
          </div>

          <div>
            <label
              style={{
                display: 'block',
                fontSize: '0.875rem',
                fontWeight: 500,
                color: 'var(--text-secondary)',
                marginBottom: '6px',
              }}
            >
              {t('password')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('passwordPlaceholder')}
              style={{ width: '100%' }}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="linear-btn-primary"
            style={{
              width: '100%',
              padding: '10px',
              marginTop: '10px',
              fontSize: '0.8125rem',
              fontWeight: 500,
              opacity: loading ? 0.65 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? t('loggingIn') : t('login')}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <Link
            href="/forgot-password"
            style={{
              fontSize: '0.875rem',
              color: 'var(--accent)',
              textDecoration: 'none',
            }}
          >
            {t('forgotPassword')}
          </Link>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
            {t('noAccount')}{' '}
            <Link href={`/signup?next=${encodeURIComponent(nextPath)}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
              {t('signUp')}
            </Link>
          </div>
          <Link href="/" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← {t('appTitle')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  const { t } = useI18n();
  return (
    <Suspense
      fallback={
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
      }
    >
      <LoginForm />
    </Suspense>
  );
}
