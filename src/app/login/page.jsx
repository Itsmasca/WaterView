'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  User,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Droplets,
  AlertCircle,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function LoginPage() {
  const { login, loading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState(null);
  const [formData, setFormData] = useState({
    username: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setFormError(null);
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (!formData.username || !formData.password) {
      setFormError('Por favor completa todos los campos');
      return;
    }

    const result = await login(formData.username, formData.password);
    if (!result.success) {
      setFormError(result.error);
    }
  };

  const displayError = formError || error;

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <div className="logo-icon">
            <Droplets size={28} color="#0A0A0F" />
          </div>
        </div>
        <h1 className="auth-title">Bienvenido de vuelta</h1>
        <p className="auth-subtitle">Ingresa tus credenciales para acceder al dashboard</p>

        {displayError && (
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Usuario</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                name="username"
                className="form-input"
                placeholder="tu_usuario"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="form-footer">
            <div className="checkbox-wrapper">
              <input type="checkbox" className="checkbox" id="remember" />
              <label htmlFor="remember" className="checkbox-label">Recordarme</label>
            </div>
            <Link href="/forgot-password" className="forgot-link">
              ¿Olvidaste tu contraseña?
            </Link>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={20} className="spin" />
                Ingresando...
              </>
            ) : (
              <>
                Iniciar sesión
                <ArrowRight size={20} />
              </>
            )}
          </button>
        </form>

        <p className="auth-switch" style={{ marginTop: '24px' }}>
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="auth-switch-link">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
