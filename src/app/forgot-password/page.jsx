'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Mail,
  ArrowLeft,
  ArrowRight,
  Loader2,
  CheckCircle,
  GitBranch,
} from 'lucide-react';

export default function ForgotPasswordPage() {
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSent(true);
    }, 1500);
  };

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
          Ingresa tu correo electrónico y te enviaremos un enlace para restablecer tu contraseña
        </p>

        {sent ? (
          <div className="success-message">
            <CheckCircle size={24} />
            <p>
              Hemos enviado un enlace de recuperación a <strong>{email}</strong>.
              Revisa tu bandeja de entrada.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Correo electrónico</label>
              <div className="input-wrapper">
                <Mail size={18} className="input-icon" />
                <input
                  type="email"
                  className="form-input"
                  placeholder="tu@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <button type="submit" className="btn-auth" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 size={20} className="spin" />
                  Enviando...
                </>
              ) : (
                <>
                  Enviar enlace de recuperación
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
