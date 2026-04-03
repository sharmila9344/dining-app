import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

const Register = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [loading, setLoading] = useState(false);

  const validate = (data = form) => {
    const errs = {};
    if (!data.name.trim()) errs.name = 'Full name is required';
    else if (data.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
    if (!data.email) errs.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(data.email)) errs.email = 'Enter a valid email address';
    if (!data.password) errs.password = 'Password is required';
    else if (data.password.length < 6) errs.password = 'Password must be at least 6 characters';
    else if (!/[A-Z]/.test(data.password) && !/[0-9]/.test(data.password)) errs.password = 'Include at least one number or uppercase letter';
    if (!data.confirm) errs.confirm = 'Please confirm your password';
    else if (data.password !== data.confirm) errs.confirm = 'Passwords do not match';
    return errs;
  };

  const getPasswordStrength = () => {
    const p = form.password;
    if (!p) return { level: 0, label: '' };
    let score = 0;
    if (p.length >= 6) score++;
    if (p.length >= 10) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^a-zA-Z0-9]/.test(p)) score++;
    const levels = ['', 'Weak', 'Fair', 'Good', 'Strong', 'Very Strong'];
    return { level: score, label: levels[Math.min(score, 5)] };
  };

  const handleChange = (e) => {
    const updated = { ...form, [e.target.name]: e.target.value };
    setForm(updated);
    if (touched[e.target.name]) setErrors(validate(updated));
  };

  const handleBlur = (e) => {
    setTouched(t => ({ ...t, [e.target.name]: true }));
    setErrors(validate());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setTouched({ name: true, email: true, password: true, confirm: true });
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      await register(form.name, form.email, form.password);
      navigate('/');
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Registration failed. Please try again.' });
    } finally {
      setLoading(false);
    }
  };

  const strength = getPasswordStrength();
  const strengthColors = ['', '#ef4444', '#f97316', '#eab308', '#22c55e', '#16a34a'];

  return (
    <div className="auth-page">
      <div className="auth-image">
        <img src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=1200" alt="Restaurant" />
        <div className="auth-image-overlay">
          <h2>"Good food is all the sweeter when shared with good friends."</h2>
          <p>Join thousands of food lovers.</p>
        </div>
      </div>

      <div className="auth-form-side">
        <div className="auth-form-wrapper">
          <Link to="/" className="auth-brand">🍽️ DineGuide</Link>
          <h1>Create account</h1>
          <p className="auth-subtitle">Start discovering amazing dining experiences</p>

          {errors.submit && <div className="alert alert-error">{errors.submit}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label>Full Name</label>
              <input type="text" name="name" className={`form-control ${errors.name && touched.name ? 'error' : ''}`}
                value={form.name} onChange={handleChange} onBlur={handleBlur} placeholder="John Smith" />
              {errors.name && touched.name && <span className="error-msg">⚠ {errors.name}</span>}
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input type="email" name="email" className={`form-control ${errors.email && touched.email ? 'error' : ''}`}
                value={form.email} onChange={handleChange} onBlur={handleBlur} placeholder="you@example.com" />
              {errors.email && touched.email && <span className="error-msg">⚠ {errors.email}</span>}
            </div>

            <div className="form-group">
              <label>Password</label>
              <input type="password" name="password" className={`form-control ${errors.password && touched.password ? 'error' : ''}`}
                value={form.password} onChange={handleChange} onBlur={handleBlur} placeholder="Min. 6 characters" />
              {form.password && (
                <div className="password-strength">
                  <div className="strength-bar">
                    {[1,2,3,4,5].map(i => (
                      <div key={i} className="strength-segment" style={{ background: i <= strength.level ? strengthColors[strength.level] : '#e5e7eb' }}></div>
                    ))}
                  </div>
                  <span style={{ color: strengthColors[strength.level], fontSize: '0.8rem' }}>{strength.label}</span>
                </div>
              )}
              {errors.password && touched.password && <span className="error-msg">⚠ {errors.password}</span>}
            </div>

            <div className="form-group">
              <label>Confirm Password</label>
              <input type="password" name="confirm" className={`form-control ${errors.confirm && touched.confirm ? 'error' : ''}`}
                value={form.confirm} onChange={handleChange} onBlur={handleBlur} placeholder="Repeat your password" />
              {errors.confirm && touched.confirm && <span className="error-msg">⚠ {errors.confirm}</span>}
              {!errors.confirm && touched.confirm && form.confirm && form.password === form.confirm && (
                <span style={{ color: '#16a34a', fontSize: '0.82rem' }}>✓ Passwords match</span>
              )}
            </div>

            <button type="submit" className="btn btn-primary auth-submit" disabled={loading}>
              {loading ? <><span className="btn-spinner"></span> Creating account...</> : 'Create Account →'}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
