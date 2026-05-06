'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../lib/AuthContext';
import { useI18n } from '../lib/i18n';
import Link from 'next/link';

export default function ResetPasswordPage() {
  const router = useRouter();
  const { updatePassword } = useAuth();
  const { t } = useI18n();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    if (!password) {
      setError(t('enterNewPassword'));
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

    const { error } = await updatePassword(password);
    if (error) {
      setError(t('updatePasswordError'));
      setLoading(false);
    } else {
      setSuccess(t('passwordUpdated'));
      setTimeout(() => router.push('/login?next=%2Fdashboard'), 2000);
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
          {t('resetPasswordTitle')}
        </h1>
        <p style={{ 
          fontSize: '0.875rem', 
          color: 'var(--text-secondary)',
          marginBottom: '24px'
        }}>
          {t('resetPasswordSubtitle')}
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
              {t('newPassword')}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t('newPasswordPlaceholder')}
              style={{ width: '100%' }}
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ 
              display: 'block', 
              fontSize: '0.875rem', 
              fontWeight: 500,
              color: 'var(--text-secondary)',
              marginBottom: '6px'
            }}>
              {t('confirmNewPassword')}
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder={t('confirmNewPasswordPlaceholder')}
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
            {loading ? t('updating') : t('updatePassword')}
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
        </div>
      </div>
    </div>
  );
}
