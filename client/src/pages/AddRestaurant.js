import React, { useState } from 'react';
import { useNavigate, Navigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './AddRestaurant.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CATEGORIES = ['Fine Dining', 'Casual', 'Fast Food', 'Cafe', 'Street Food', 'Buffet', 'Vegan', 'Seafood'];
const PRICE_RANGES = ['$', '$$', '$$$', '$$$$'];
const FEATURES = ['delivery', 'takeout', 'dineIn', 'reservations', 'outdoor', 'wifi', 'parking'];
const FEATURE_LABELS = { delivery: '🚗 Delivery', takeout: '📦 Takeout', dineIn: '🍽️ Dine In', reservations: '📅 Reservations', outdoor: '🌿 Outdoor Seating', wifi: '📶 Free WiFi', parking: '🅿️ Parking' };

const AddRestaurant = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name: '', description: '', cuisine: '', category: '', priceRange: '',
    phone: '', website: '', image: '',
    address: { street: '', city: '', state: '', zip: '' },
    features: { delivery: false, takeout: false, dineIn: true, reservations: false, outdoor: false, wifi: false, parking: false },
    tags: ''
  });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  if (!user) return <Navigate to="/login" />;

  const validateStep = (s = step) => {
    const errs = {};
    if (s === 1) {
      if (!form.name.trim()) errs.name = 'Restaurant name is required';
      else if (form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters';
      if (!form.description.trim()) errs.description = 'Description is required';
      else if (form.description.trim().length < 20) errs.description = 'Description must be at least 20 characters';
      if (!form.cuisine.trim()) errs.cuisine = 'Cuisine type is required';
      if (!form.category) errs.category = 'Category is required';
      if (!form.priceRange) errs.priceRange = 'Price range is required';
    }
    if (s === 2) {
      if (!form.address.city.trim()) errs.city = 'City is required';
      if (form.phone && !/^[\d\s\-\+\(\)]{7,15}$/.test(form.phone)) errs.phone = 'Enter a valid phone number';
      if (form.website && !/^https?:\/\/.+/.test(form.website)) errs.website = 'URL must start with http:// or https://';
    }
    return errs;
  };

  const nextStep = () => {
    const errs = validateStep();
    setErrors(errs);
    if (Object.keys(errs).length === 0) setStep(s => s + 1);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('address.')) {
      const key = name.split('.')[1];
      setForm(p => ({ ...p, address: { ...p.address, [key]: value } }));
    } else {
      setForm(p => ({ ...p, [name]: value }));
    }
    if (errors[name] || errors[name.split('.')[1]]) setErrors(p => ({ ...p, [name]: undefined, [name.split('.')[1]]: undefined }));
  };

  const toggleFeature = (feat) => setForm(p => ({ ...p, features: { ...p.features, [feat]: !p.features[feat] } }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean)
      };
      const { data } = await axios.post(`${API}/restaurants`, payload);
      navigate(`/restaurants/${data._id}`);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to add restaurant' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="add-restaurant-page">
      <div className="page-hero" style={{ padding: '60px 0' }}>
        <div className="container">
          <h1>Add Your Restaurant</h1>
          <p>Join hundreds of restaurants on DineGuide and reach new customers</p>
        </div>
      </div>

      <div className="container add-form-container">
        {/* Steps */}
        <div className="steps-indicator">
          {['Basic Info', 'Location & Contact', 'Features', 'Review & Submit'].map((label, i) => (
            <div key={i} className={`step ${step === i + 1 ? 'active' : ''} ${step > i + 1 ? 'done' : ''}`}>
              <div className="step-num">{step > i + 1 ? '✓' : i + 1}</div>
              <span>{label}</span>
            </div>
          ))}
        </div>

        <div className="add-form-card card">
          {errors.submit && <div className="alert alert-error mb-3">{errors.submit}</div>}

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="form-step">
              <h2>Basic Information</h2>
              <div className="form-group">
                <label>Restaurant Name *</label>
                <input name="name" className={`form-control ${errors.name ? 'error' : ''}`} value={form.name} onChange={handleChange} placeholder="e.g. The Golden Spoon" />
                {errors.name && <span className="error-msg">⚠ {errors.name}</span>}
              </div>
              <div className="form-group">
                <label>Description *</label>
                <textarea name="description" className={`form-control ${errors.description ? 'error' : ''}`} value={form.description} onChange={handleChange} rows={4} placeholder="Describe your restaurant, specialties, atmosphere..." />
                <span className="char-hint">{form.description.length}/500 characters</span>
                {errors.description && <span className="error-msg">⚠ {errors.description}</span>}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Cuisine Type *</label>
                  <input name="cuisine" className={`form-control ${errors.cuisine ? 'error' : ''}`} value={form.cuisine} onChange={handleChange} placeholder="e.g. Italian, Japanese, Indian" />
                  {errors.cuisine && <span className="error-msg">⚠ {errors.cuisine}</span>}
                </div>
                <div className="form-group">
                  <label>Category *</label>
                  <select name="category" className={`form-control ${errors.category ? 'error' : ''}`} value={form.category} onChange={handleChange}>
                    <option value="">Select category</option>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                  {errors.category && <span className="error-msg">⚠ {errors.category}</span>}
                </div>
              </div>
              <div className="form-group">
                <label>Price Range *</label>
                <div className="price-selector">
                  {PRICE_RANGES.map(p => (
                    <button key={p} type="button" className={`price-opt ${form.priceRange === p ? 'active' : ''}`} onClick={() => setForm(prev => ({ ...prev, priceRange: p }))}>
                      {p}
                    </button>
                  ))}
                </div>
                {errors.priceRange && <span className="error-msg">⚠ {errors.priceRange}</span>}
              </div>
              <div className="form-group">
                <label>Image URL (optional)</label>
                <input name="image" className="form-control" value={form.image} onChange={handleChange} placeholder="https://example.com/image.jpg" />
              </div>
              <div className="form-group">
                <label>Tags (optional, comma-separated)</label>
                <input name="tags" className="form-control" value={form.tags} onChange={handleChange} placeholder="romantic, family-friendly, outdoor" />
              </div>
            </div>
          )}

          {/* Step 2: Location & Contact */}
          {step === 2 && (
            <div className="form-step">
              <h2>Location & Contact</h2>
              <div className="form-group">
                <label>Street Address</label>
                <input name="address.street" className="form-control" value={form.address.street} onChange={handleChange} placeholder="123 Main Street" />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>City *</label>
                  <input name="address.city" className={`form-control ${errors.city ? 'error' : ''}`} value={form.address.city} onChange={handleChange} placeholder="New York" />
                  {errors.city && <span className="error-msg">⚠ {errors.city}</span>}
                </div>
                <div className="form-group">
                  <label>State</label>
                  <input name="address.state" className="form-control" value={form.address.state} onChange={handleChange} placeholder="NY" />
                </div>
                <div className="form-group">
                  <label>ZIP</label>
                  <input name="address.zip" className="form-control" value={form.address.zip} onChange={handleChange} placeholder="10001" />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input name="phone" className={`form-control ${errors.phone ? 'error' : ''}`} value={form.phone} onChange={handleChange} placeholder="(212) 555-0100" />
                  {errors.phone && <span className="error-msg">⚠ {errors.phone}</span>}
                </div>
                <div className="form-group">
                  <label>Website</label>
                  <input name="website" className={`form-control ${errors.website ? 'error' : ''}`} value={form.website} onChange={handleChange} placeholder="https://yourrestaurant.com" />
                  {errors.website && <span className="error-msg">⚠ {errors.website}</span>}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Features */}
          {step === 3 && (
            <div className="form-step">
              <h2>Features & Amenities</h2>
              <p className="step-desc">Let customers know what's available at your restaurant</p>
              <div className="features-selector">
                {FEATURES.map(feat => (
                  <button key={feat} type="button" className={`feature-toggle ${form.features[feat] ? 'active' : ''}`} onClick={() => toggleFeature(feat)}>
                    {FEATURE_LABELS[feat]}
                    {form.features[feat] && <span className="feat-check"> ✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Review */}
          {step === 4 && (
            <div className="form-step">
              <h2>Review & Submit</h2>
              <div className="review-summary">
                <div className="summary-section">
                  <h3>📋 Basic Info</h3>
                  <p><strong>{form.name}</strong> · {form.cuisine} · {form.category} · {form.priceRange}</p>
                  <p className="summary-desc">{form.description}</p>
                </div>
                <div className="summary-section">
                  <h3>📍 Location</h3>
                  <p>{form.address.street && `${form.address.street}, `}{form.address.city}{form.address.state && `, ${form.address.state}`}</p>
                  {form.phone && <p>📞 {form.phone}</p>}
                </div>
                <div className="summary-section">
                  <h3>✨ Features</h3>
                  <div className="feat-pills">
                    {Object.entries(form.features).filter(([,v]) => v).map(([k]) => (
                      <span key={k} className="feat-pill">{FEATURE_LABELS[k]}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="step-nav">
            {step > 1 && <button type="button" className="btn btn-ghost" onClick={() => setStep(s => s - 1)}>← Back</button>}
            {step < 4 && <button type="button" className="btn btn-primary" onClick={nextStep}>Continue →</button>}
            {step === 4 && (
              <button type="button" className="btn btn-primary" onClick={handleSubmit} disabled={submitting}>
                {submitting ? 'Submitting...' : '🎉 Submit Restaurant'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRestaurant;
