import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState({});

  // Real-time validation
  const validate = (data = form) => {
    const errs = {};
    if (!data.email) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) errs.email = 'Enter a valid email address';
    if (!data.password) errs.password = 'Password is required';
    else if (data.password.length < 6) errs.password = 'Password must be at least 6 characters';
    return errs;
  };

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (touched[e.target.name]) {
      setErrors(validate(updated));
    }
  };

  const handleBlur = (e) => {
    setTouched(t => ({ ...t, [e.target.name]: true }));
    setErrors(validate());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ email: true, password: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      await login(form.email, form.password);
      navigate('/');
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Login failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-image">
        <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200" alt="Restaurant" />
        <div className="auth-image-overlay">
          <h2>"Life is too short to eat mediocre food."</h2>
          <p>Discover extraordinary dining experiences.</p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          <Link to="/" className="auth-brand">🍽️ DineGuide</Link>
          <h1>Welcome back</h1>
          <p className="auth-subtitle">Sign in to discover your next great meal</p>

          {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                id="email" type="email" name="email" className={`form-control ${errors.email && touched.email ? 'error' : ''}`}
                value={form.email} onChange={handleChange} onBlur={handleBlur}
                placeholder="you@example.com" autoComplete="email"
              />
              {errors.email && touched.email && <span className="error-msg">⚠ {errors.email}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                id="password" type="password" name="password" className={`form-control ${errors.password && touched.password ? 'error' : ''}`}
                value={form.password} onChange={handleChange} onBlur={handleBlur}
                placeholder="Your password" autoComplete="current-password"
              />
              {errors.password && touched.password && <span className="error-msg">⚠ {errors.password}</span>}
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <><span className="btn-spinner"></span> Signing in...</> : 'Sign In →'}
            </button>
          </form>

          <p className="auth-switch">
            Don't have an account? <Link to="/register">Create one free</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
