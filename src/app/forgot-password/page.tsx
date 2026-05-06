'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { useI18n } from '../lib/i18n';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const router = useRouter();
  const { user, resetPassword, loading: authLoading } = useAuth();
  const { t } = useI18n();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user && !authLoading) {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  if (authLoading || user) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        background: 'var(--bg-page)'
      }}>
        <div style={{ color: 'var(--text-secondary)' }}>{t('loading')}</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!email) {
      setError(t('enterEmail'));
      setLoading(false);
      return;
    }

    const { error } = await resetPassword(email);
    if (error) {
      setError(t('resetError'));
      setLoading(false);
    } else {
      setSuccess(t('resetEmailSent'));
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: 'var(--bg-page)',
      padding: '20px'
    }}>
      <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '32px' }}>
        <h1 style={{ 
          fontSize: '1.5rem', 
          fontWeight: 600, 
          marginBottom: '8px',
          color: 'var(--text-primary)'
        }}>
          {t('forgotPasswordTitle')}
        </h1>
        <p style={{ 
          fontSize: '0.875rem', 
          color: 'var(--text-secondary)',
          marginBottom: '24px'
        }}>
          {t('forgotPasswordSubtitle')}
        </p>

        {error && (
          <div style={{ 
            background: 'var(--danger-soft)', 
            color: 'var(--danger)',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '16px',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ 
            background: 'var(--success-soft)', 
            color: 'var(--success)',
            padding: '12px 16px',
            borderRadius: '10px',
            marginBottom: '16px',
            fontSize: '0.875rem'
          }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
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
              cursor: loading ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? t('sending') : t('sendResetLink')}
          </button>
        </form>

        <div style={{ 
          marginTop: '24px', 
          textAlign: 'center',
          fontSize: '0.875rem', 
          color: 'var(--text-secondary)'
        }}>
          <Link 
            href="/login"
            style={{ color: 'var(--accent)', textDecoration: 'none' }}
          >
            {t('backToLogin')}
          </Link>
          <div style={{ marginTop: 12 }}>
            <Link href="/" style={{ color: 'var(--text-muted)', textDecoration: 'none', fontSize: '0.8125rem' }}>
              ← {t('appTitle')}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
