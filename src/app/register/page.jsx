'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  User,
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

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      router.push('/login');
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
        <h1 className="auth-title">Crear cuenta</h1>
        <p className="auth-subtitle">Regístrate para comenzar a monitorear tu API GraphQL</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Nombre completo</label>
            <div className="input-wrapper">
              <User size={18} className="input-icon" />
              <input
                type="text"
                className="form-input"
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Correo electrónico</label>
            <div className="input-wrapper">
              <Mail size={18} className="input-icon" />
              <input
                type="email"
                className="form-input"
                placeholder="tu@email.com"
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
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
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
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

          <div className="form-group">
            <label className="form-label">Confirmar contraseña</label>
            <div className="input-wrapper">
              <Lock size={18} className="input-icon" />
              <input
                type={showPassword ? 'text' : 'password'}
                className="form-input"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
              />
            </div>
          </div>

          <div className="checkbox-wrapper" style={{ marginBottom: '24px' }}>
            <input type="checkbox" className="checkbox" id="terms" />
            <label htmlFor="terms" className="checkbox-label">
              Acepto los términos de servicio y política de privacidad
            </label>
          </div>

          <button type="submit" className="btn-auth" disabled={loading}>
            {loading ? (
              <>
                <Loader2 size={20} className="spin" />
                Creando cuenta...
              </>
            ) : (
              <>
                Crear cuenta
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
          ¿Ya tienes una cuenta?{' '}
          <Link href="/login" className="auth-switch-link">
            Inicia sesión
          </Link>
        </p>
      </div>
    </div>
  );
}
