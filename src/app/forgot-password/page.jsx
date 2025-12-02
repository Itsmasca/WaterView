'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle,
  GitBranch,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function ForgotPasswordPage() {
  const { resetPassword, loading, error, clearError } = useAuth();
  const [sent, setSent] = useState(false);
  const [formError, setFormError] = useState(null);
  const [username, setUsername] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setUsername(e.target.value);
    setFormError(null);
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!username) {
      setFormError('Por favor ingresa tu nombre de usuario');
      return;
    }

    const result = await resetPassword(username);
    if (result.success) {
      setSent(true);
      setSuccessMessage(result.message);
    } else {
      setFormError(result.error);
    }
  };

  const displayError = formError || error;

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <Link href="/login" className="back-link">
          <ArrowLeft size={18} />
          Volver al login
        </Link>

        <div className="auth-logo">
          <div className="logo-icon">
            <GitBranch size={28} color="#0A0A0F" />
          </div>
        </div>
        <h1 className="auth-title">Recuperar contraseña</h1>
        <p className="auth-subtitle">
          Ingresa tu nombre de usuario para restablecer tu contraseña
        </p>

        {displayError && !sent && (
          <div className="error-message" style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid var(--accent-red)',
            borderRadius: '12px',
            padding: '12px 16px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
          }}>
            <AlertCircle size={20} style={{ color: 'var(--accent-red)', flexShrink: 0 }} />
            <span style={{ color: 'var(--accent-red)', fontSize: '14px' }}>{displayError}</span>
          </div>
        )}

        {sent ? (
          <div className="success-message">
            <CheckCircle size={24} />
            <div>
              <p><strong>Contraseña restablecida</strong></p>
              <p style={{ marginTop: '4px', opacity: 0.9 }}>
                {successMessage || `La contraseña de ${username} ha sido restablecida a 'Password1234!'`}
              </p>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Nombre de usuario</label>
              <div className="input-wrapper">
                <User size={18} className="input-icon" />
                <input
                  type="text"
                  className="form-input"
                  placeholder="tu_usuario"
                  value={username}
                  onChange={handleChange}
                  disabled={loading}
                />
              </div>
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={20} className="spin" />
                  Procesando...
                </>
              ) : (
                <>
                  Restablecer contraseña
                  <ArrowRight size={20} />
                </>
              )}
            </button>
          </form>
        )}

        <p className="auth-switch" style={{ marginTop: '32px' }}>
          ¿Recordaste tu contraseña?{' '}
          <Link href="/login" className="auth-switch-link">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
