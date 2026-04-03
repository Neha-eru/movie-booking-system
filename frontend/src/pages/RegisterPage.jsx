import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../api/axios';
import { toast } from 'react-toastify';

const RegisterPage = () => {
  const { login } = useAuth();
  const navigate  = useNavigate();

  const [form, setForm] = useState({
    username: '', email: '', password: '', confirmPassword: ''
  });
  const [errors,  setErrors]  = useState({});
  const [loading, setLoading] = useState(false);

  const validate = () => {
    const e = {};
    if (!form.username || form.username.length < 3)
      e.username = 'Username must be at least 3 characters';
    if (!form.email)
      e.email = 'Email is required';
    if (!form.password || form.password.length < 6)
      e.password = 'Password must be at least 6 characters';
    if (form.password !== form.confirmPassword)
      e.confirmPassword = 'Passwords do not match';
    return e;
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      const { data } = await authAPI.register({
        username: form.username,
        email:    form.email,
        password: form.password,
      });
      login(data);
      toast.success(`Account created! Welcome, ${data.username}! 🎉`);
      navigate('/');
    } catch (err) {
      const msg = err.response?.data?.message
        || Object.values(err.response?.data || {}).join(', ')
        || 'Registration failed';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>🎬 CineBook</h1>
          <h2>Create Account</h2>
          <p>Join us and start booking movies!</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label><i className="fas fa-user"></i> Username</label>
            <input
              type="text"
              name="username"
              value={form.username}
              onChange={handleChange}
              placeholder="johndoe"
            />
            {errors.username && <p className="form-error">{errors.username}</p>}
          </div>

          <div className="form-group">
            <label><i className="fas fa-envelope"></i> Email</label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
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
              placeholder="Min. 6 characters"
            />
            {errors.password && <p className="form-error">{errors.password}</p>}
          </div>

          <div className="form-group">
            <label><i className="fas fa-lock"></i> Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
            />
            {errors.confirmPassword &&
              <p className="form-error">{errors.confirmPassword}</p>}
          </div>

          <button type="submit" className="btn-primary w-full" disabled={loading}>
            {loading
              ? <><i className="fas fa-spinner fa-spin"></i> Creating Account...</>
              : <><i className="fas fa-user-plus"></i> Create Account</>}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account? <Link to="/login">Sign in</Link>
        </p>
      </div>

      <style>{`
        .auth-page {
          min-height: calc(100vh - 70px);
          display: flex; align-items: center;
          justify-content: center; padding: 2rem;
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
        .auth-switch {
          text-align: center; margin-top: 1.5rem;
          color: var(--text-secondary); font-size: 0.9rem;
        }
        .auth-switch a { color: var(--primary); font-weight: 600; }
      `}</style>
    </div>
  );
};

export default RegisterPage;