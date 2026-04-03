import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI, getErrorMessage } from '../api/axios';
import { toast } from 'react-toastify';

const LoginPage = () => {
  const { login, isAuthenticated, isAdmin } = useAuth();
  const navigate = useNavigate();

  const [form,    setForm]    = useState({ email: '', password: '' });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? '/admin' : '/', { replace: true });
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const validate = () => {
    const e = {};
    if (!form.email)    e.email    = 'Email is required';
    if (!form.password) e.password = 'Password is required';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { data } = await authAPI.login(form);
      login(data);
      toast.success(`Welcome back, ${data.username}! 🎬`);
      navigate(data.role === 'ADMIN' ? '/admin' : '/');
    } catch (err) {
      toast.error(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🎬 CineBook</h1>
          <h2>Welcome Back</h2>
          <p>Sign in to book your favourite movies</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label><i className="fas fa-envelope"></i> Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
            />
            {errors.email && <p className="form-error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label><i className="fas fa-lock"></i> Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter your password"
              autoComplete="current-password"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading
              ? <><i className="fas fa-spinner fa-spin"></i> Signing In...</>
              : <><i className="fas fa-sign-in-alt"></i> Sign In</>}
          </button>
        </form>

        <div className="auth-demo-creds">
          <p>🧪 <strong>Demo Credentials</strong></p>
          <p>Admin → admin@moviebooking.com / admin123</p>
          <p>User &nbsp;→ john@example.com / user123</p>
        </div>

        <p className="auth-switch">
          Don't have an account? <Link to="/register">Create one free</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - 70px);
          display: flex; align-items: center; justify-content: center;
          padding: 2rem;
          background: radial-gradient(ellipse at center, #16213e 0%, #1a1a2e 70%);
        }
        .auth-card {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; padding: 2.5rem;
          width: 100%; max-width: 440px;
          box-shadow: 0 25px 60px rgba(0,0,0,0.5);
        }
        .auth-header { text-align: center; margin-bottom: 2rem; }
        .auth-header h1 { font-size: 2rem; color: var(--primary); margin-bottom: 0.5rem; }
        .auth-header h2 { font-size: 1.4rem; margin-bottom: 0.3rem; }
        .auth-header p  { color: var(--text-secondary); font-size: 0.95rem; }
        .auth-form { display: flex; flex-direction: column; gap: 0.2rem; }
        .w-full { width: 100%; margin-top: 0.5rem; justify-content: center; }
        .auth-demo-creds {
          margin-top: 1.5rem; background: var(--surface-light);
          border: 1px dashed var(--border); border-radius: 10px;
          padding: 1rem; font-size: 0.82rem;
          color: var(--text-secondary); line-height: 1.8;
        }
        .auth-demo-creds strong { color: var(--warning); }
        .auth-switch {
          text-align: center; margin-top: 1.5rem;
          color: var(--text-secondary); font-size: 0.9rem;
        }
        .auth-switch a { color: var(--primary); font-weight: 600; }
      `}</style>
    </div>
  );
};

export default LoginPage;