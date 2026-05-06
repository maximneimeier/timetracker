'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { useI18n } from '../lib/i18n';
import Link from 'next/link';
import { getSafeNextPath } from '../lib/navigation';

function SignupForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const nextPath = getSafeNextPath(searchParams.get('next'));

  const { user, signUp, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
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

    if (!name || !email || !password) {
      setError(t('fillAllFields'));
      setLoading(false);
      return;
    }

    if (password.length < 6) {
      setError(t('passwordTooShort'));
      setLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      setError(t('passwordsDoNotMatch'));
      setLoading(false);
      return;
    }

    const { error } = await signUp(email, password, name);
    if (error) {
      setError(t('signupError'));
      setLoading(false);
    } else {
      setSuccess(t('signupSuccess'));
      setTimeout(() => router.push(`/login?next=${encodeURIComponent(nextPath)}`), 2000);
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
          {t('signupTitle')}
        </h1>
        <p
          style={{
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
            marginBottom: '24px',
          }}
        >
          {t('signupSubtitle')}
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
              {t('name')}
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t('namePlaceholder')}
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
              {t('confirmPassword')}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('confirmPasswordPlaceholder')}
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
            {loading ? t('signingUp') : t('signUp')}
          </button>
        </form>

        <div
          style={{
            marginTop: '24px',
            textAlign: 'center',
            fontSize: '0.875rem',
            color: 'var(--text-secondary)',
          }}
        >
          {t('alreadyHaveAccount')}{' '}
          <Link href={`/login?next=${encodeURIComponent(nextPath)}`} style={{ color: 'var(--accent)', textDecoration: 'none' }}>
            {t('login')}
          </Link>
        </div>
        <div style={{ marginTop: 16, textAlign: 'center' }}>
          <Link href="/" style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', textDecoration: 'none' }}>
            ← {t('appTitle')}
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function SignupPage() {
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
      <SignupForm />
    </Suspense>
  );
}
