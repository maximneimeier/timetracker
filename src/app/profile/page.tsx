'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function ProfilePage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [activeSection, setActiveSection] = useState<'profile' | 'password'>('profile');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Check if user is logged in via localStorage or session
    const checkAuth = async () => {
      // For now, show the page regardless of auth state
      // In a real implementation, you'd check the auth state here
      setIsLoggedIn(false);
    };
    checkAuth();
  }, []);

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Profil aktualisiert! (Demo)');
    } catch (err: any) {
      setError(err.message || 'Fehler beim Aktualisieren');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newPassword !== confirmPassword) {
      setError('Passwörter stimmen nicht überein');
      return;
    }

    if (newPassword.length < 6) {
      setError('Passwort muss mindestens 6 Zeichen haben');
      return;
    }

    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      setSuccess('Passwort geändert! (Demo)');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      setError(err.message || 'Fehler beim Ändern des Passworts');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: 'var(--bg-page)',
      padding: '40px 20px'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '32px', textAlign: 'center' }}>
          <h1 style={{ 
            fontSize: '1.75rem', 
            fontWeight: 700, 
            marginBottom: '8px',
            color: 'var(--text-primary)'
          }}>
            Profil
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Verwalte dein Konto
          </p>
        </div>

        {/* User Info Card */}
        <div style={{
          background: 'var(--bg-card)',
          border: '1px solid var(--border-color)',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              width: '56px',
              height: '56px',
              borderRadius: '50%',
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              fontWeight: 600,
              color: '#ffffff'
            }}>
              {name ? name[0].toUpperCase() : email ? email[0].toUpperCase() : '?'}
            </div>
            <div>
              <div style={{ 
                fontSize: '1.125rem', 
                fontWeight: 600,
                color: 'var(--text-primary)'
              }}>
                {name || 'Benutzer'}
              </div>
              <div style={{ 
                fontSize: '0.875rem',
                color: 'var(--text-secondary)'
              }}>
                {email || 'Nicht eingeloggt'}
              </div>
            </div>
          </div>
        </div>

        {/* Login Notice */}
        {!isLoggedIn && (
          <div style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '10px',
            padding: '16px',
            marginBottom: '24px',
            textAlign: 'center'
          }}>
            <p style={{ color: 'var(--text-primary)', marginBottom: '12px' }}>
              Melde dich an, um dein Profil zu verwalten
            </p>
            <Link
              href="/login"
              style={{
                display: 'inline-block',
                padding: '10px 20px',
                borderRadius: '10px',
                background: 'var(--accent)',
                color: '#ffffff',
                textDecoration: 'none',
                fontWeight: 600
              }}
            >
              Zum Login
            </Link>
          </div>
        )}

        {/* Section Tabs */}
        <div style={{
          display: 'flex',
          gap: '8px',
          marginBottom: '24px'
        }}>
          <button
            onClick={() => setActiveSection('profile')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: activeSection === 'profile' ? 'var(--accent)' : 'var(--bg-card)',
              color: activeSection === 'profile' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            Profil
          </button>
          <button
            onClick={() => setActiveSection('password')}
            style={{
              flex: 1,
              padding: '12px',
              borderRadius: '10px',
              border: 'none',
              fontSize: '0.875rem',
              fontWeight: 500,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              background: activeSection === 'password' ? 'var(--accent)' : 'var(--bg-card)',
              color: activeSection === 'password' ? '#ffffff' : 'var(--text-secondary)'
            }}
          >
            Passwort
          </button>
        </div>

        {/* Messages */}
        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '16px',
            color: '#ef4444',
            fontSize: '0.875rem'
          }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{
            background: 'rgba(34, 197, 94, 0.1)',
            border: '1px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            marginBottom: '16px',
            color: '#22c55e',
            fontSize: '0.875rem'
          }}>
            {success}
          </div>
        )}

        {/* Profile Form */}
        {activeSection === 'profile' && (
          <form onSubmit={handleUpdateProfile} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                marginBottom: '6px'
              }}>
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Dein Name"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-inner)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9375rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                marginBottom: '6px'
              }}>
                E-Mail
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="deine@email.de"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-inner)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9375rem',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'var(--accent)',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'Speichern...' : 'Speichern'}
            </button>
          </form>
        )}

        {/* Password Form */}
        {activeSection === 'password' && (
          <form onSubmit={handleUpdatePassword} style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-color)',
            borderRadius: '16px',
            padding: '24px'
          }}>
            <div style={{ marginBottom: '20px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                marginBottom: '6px'
              }}>
                Neues Passwort
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Mindestens 6 Zeichen"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-inner)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9375rem',
                  outline: 'none'
                }}
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{
                display: 'block',
                fontSize: '0.8125rem',
                color: 'var(--text-secondary)',
                marginBottom: '6px'
              }}>
                Passwort bestätigen
              </label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Passwort wiederholen"
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  borderRadius: '10px',
                  border: '1px solid var(--border-color)',
                  background: 'var(--bg-inner)',
                  color: 'var(--text-primary)',
                  fontSize: '0.9375rem',
                  outline: 'none'
                }}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                borderRadius: '12px',
                border: 'none',
                background: 'var(--accent)',
                color: '#ffffff',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: loading ? 'not-allowed' : 'pointer',
                opacity: loading ? 0.7 : 1,
                transition: 'all 0.2s ease'
              }}
            >
              {loading ? 'Ändern...' : 'Passwort ändern'}
            </button>
          </form>
        )}

        {/* Logout Button */}
        {isLoggedIn && (
          <button
            style={{
              width: '100%',
              padding: '14px',
              borderRadius: '12px',
              border: '1px solid var(--border-color)',
              background: 'transparent',
              color: 'var(--text-secondary)',
              fontSize: '1rem',
              fontWeight: 600,
              cursor: 'pointer',
              marginTop: '24px',
              transition: 'all 0.2s ease'
            }}
          >
            Ausloggen
          </button>
        )}

        {/* Back to App */}
        <div style={{ textAlign: 'center', marginTop: '24px' }}>
          <Link
            href="/"
            style={{
              color: 'var(--accent)',
              textDecoration: 'none',
              fontSize: '0.875rem'
            }}
          >
            ← Zurück zum TimeTracker
          </Link>
        </div>
      </div>
    </div>
  );
}
