'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Mail,
  Lock,
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Github,
  Chrome,
  GitBranch,
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/dashboard');
    }, 1500);
  };

  return (
    <div className="auth-container">
      <div className="auth-card fade-in">
        <div className="auth-logo">
          <div className="logo-icon">
            <GitBranch size={28} color="#0A0A0F" />
          </div>
        </div>
        <h1 className="auth-title">Bienvenido de vuelta</h1>
        <p className="auth-subtitle">Ingresa tus credenciales para acceder al dashboard</p>

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

          <div className="form-group">
            <label className="form-label">Contraseña</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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

        <div className="divider">
          <div className="divider-line" />
          <span className="divider-text">o continúa con</span>
          <div className="divider-line" />
        </div>

        <div className="social-buttons">
          <button className="btn-social">
            <Github size={20} />
            GitHub
          </button>
          <button className="btn-social">
            <Chrome size={20} />
            Google
          </button>
        </div>

        <p className="auth-switch">
          ¿No tienes una cuenta?{' '}
          <Link href="/register" className="auth-switch-link">
            Regístrate aquí
          </Link>
        </p>
      </div>
    </div>
  );
}
