import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import './RestaurantDetail.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Stars = ({ rating, interactive, onSelect }) => (
  <div className="stars">
    {[1,2,3,4,5].map(i => (
      <span
        key={i}
        className={`star ${i <= Math.round(rating) ? '' : 'empty'} ${interactive ? 'clickable' : ''}`}
        onClick={() => interactive && onSelect && onSelect(i)}
      >★</span>
    ))}
  </div>
);

const ReviewForm = ({ restaurantId, onReviewAdded }) => {
  const { user } = useAuth();
  const [form, setForm] = useState({ rating: 0, title: '', content: '', foodRating: 0, serviceRating: 0, ambianceRating: 0 });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const errs = {};
    if (!form.rating) errs.rating = 'Please select a rating';
    if (!form.title.trim()) errs.title = 'Title is required';
    if (form.content.trim().length < 10) errs.content = 'Review must be at least 10 characters';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    try {
      const { data } = await axios.post(`${API}/reviews`, { ...form, restaurant: restaurantId });
      onReviewAdded(data);
      setSubmitted(true);
    } catch (err) {
      setErrors({ submit: err.response?.data?.message || 'Failed to submit review' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!user) return (
    <div className="review-login-cta">
      <p>Want to share your experience?</p>
      <Link to="/login" className="btn btn-primary">Sign In to Write a Review</Link>
    </div>
  );

  if (submitted) return (
    <div className="review-success">✅ Thank you for your review! It's been submitted successfully.</div>
  );

  return (
    <form className="review-form" onSubmit={handleSubmit}>
      <h3>Write a Review</h3>
      <div className="form-group">
        <label>Overall Rating *</label>
        <Stars rating={form.rating} interactive onSelect={v => setForm(p => ({ ...p, rating: v }))} />
        {errors.rating && <span className="error-msg">{errors.rating}</span>}
      </div>
      <div className="rating-grid">
        {['food', 'service', 'ambiance'].map(cat => (
          <div key={cat} className="form-group">
            <label>{cat.charAt(0).toUpperCase() + cat.slice(1)}</label>
            <Stars rating={form[`${cat}Rating`]} interactive onSelect={v => setForm(p => ({ ...p, [`${cat}Rating`]: v }))} />
          </div>
        ))}
      </div>
      <div className="form-group">
        <label>Review Title *</label>
        <input className={`form-control ${errors.title ? 'error' : ''}`} value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} placeholder="Summarize your experience" />
        {errors.title && <span className="error-msg">{errors.title}</span>}
      </div>
      <div className="form-group">
        <label>Your Review *</label>
        <textarea className={`form-control ${errors.content ? 'error' : ''}`} value={form.content} onChange={e => setForm(p => ({ ...p, content: e.target.value }))} rows={4} placeholder="Share details of your experience..." />
        <span className="char-count">{form.content.length}/1000</span>
        {errors.content && <span className="error-msg">{errors.content}</span>}
      </div>
      {errors.submit && <div className="error-msg mb-2">{errors.submit}</div>}
      <button type="submit" className="btn btn-primary" disabled={submitting}>
        {submitting ? 'Submitting...' : 'Submit Review'}
      </button>
    </form>
  );
};

const RestaurantDetail = () => {
  const { id } = useParams();
  const { user, toggleFavorite } = useAuth();
  const [restaurant, setRestaurant] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rRes, revRes] = await Promise.all([
          axios.get(`${API}/restaurants/${id}`),
          axios.get(`${API}/reviews/restaurant/${id}`)
        ]);
        setRestaurant(rRes.data);
        setReviews(revRes.data.reviews);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) return <div className="loading-center" style={{paddingTop:'120px'}}><div className="spinner"></div></div>;
  if (!restaurant) return <div className="container text-center" style={{paddingTop:'120px'}}><h2>Restaurant not found</h2><Link to="/restaurants" className="btn btn-primary mt-3">Browse Restaurants</Link></div>;

  const isFav = user?.favorites?.includes(id);

  return (
    <div className="detail-page">
      {/* Hero Image */}
      <div className="detail-hero">
        <img src={restaurant.image} alt={restaurant.name} onError={e => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=1400'; }} />
        <div className="detail-hero-overlay"></div>
        <div className="detail-hero-content container">
          <div className="detail-badges">
            <span className="badge badge-accent">{restaurant.priceRange}</span>
            <span className="badge badge-primary">{restaurant.category}</span>
          </div>
          <h1>{restaurant.name}</h1>
          <div className="detail-meta">
            <div className="stars">
              {[1,2,3,4,5].map(i => <span key={i} className={`star ${i <= Math.round(restaurant.rating) ? '' : 'empty'}`}>★</span>)}
            </div>
            <span className="rating-big">{restaurant.rating.toFixed(1)}</span>
            <span className="review-count-big">({restaurant.reviewCount} reviews)</span>
            <span className="cuisine-tag">• {restaurant.cuisine}</span>
          </div>
          {user && (
            <button className={`fav-btn-lg ${isFav ? 'active' : ''}`} onClick={() => toggleFavorite(id)}>
              {isFav ? '❤️ Saved' : '🤍 Save Restaurant'}
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="detail-tabs">
        <div className="container">
          {['overview', 'reviews', 'info'].map(tab => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
              {tab === 'reviews' && <span className="tab-count">{restaurant.reviewCount}</span>}
            </button>
          ))}
        </div>
      </div>

      <div className="container detail-body">
        <div className="detail-main">
          {activeTab === 'overview' && (
            <div>
              <div className="detail-section">
                <h2>About</h2>
                <p>{restaurant.description}</p>
                {restaurant.tags?.length > 0 && (
                  <div className="tags-row">
                    {restaurant.tags.map(tag => <span key={tag} className="tag">#{tag}</span>)}
                  </div>
                )}
              </div>
              <div className="detail-section">
                <h2>Features & Amenities</h2>
                <div className="features-grid">
                  {Object.entries(restaurant.features || {}).map(([key, val]) => val && (
                    <div key={key} className="feature-item">
                      <span className="feature-check">✓</span>
                      <span>{key.replace(/([A-Z])/g, ' $1').replace(/^./, s => s.toUpperCase())}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="detail-section">
                <h2>Recent Reviews</h2>
                {reviews.slice(0, 3).map(rev => (
                  <div key={rev._id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-avatar">{rev.user?.name?.charAt(0)}</div>
                      <div>
                        <div className="reviewer-name">{rev.user?.name}</div>
                        <div className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="review-rating">
                        {[1,2,3,4,5].map(i => <span key={i} className={`star ${i <= rev.rating ? '' : 'empty'}`}>★</span>)}
                      </div>
                    </div>
                    <h4>{rev.title}</h4>
                    <p>{rev.content}</p>
                  </div>
                ))}
                {reviews.length === 0 && <p className="no-reviews">No reviews yet. Be the first!</p>}
              </div>
              <ReviewForm restaurantId={id} onReviewAdded={rev => setReviews(p => [rev, ...p])} />
            </div>
          )}

          {activeTab === 'reviews' && (
            <div>
              <ReviewForm restaurantId={id} onReviewAdded={rev => setReviews(p => [rev, ...p])} />
              <div className="detail-section mt-3">
                {reviews.map(rev => (
                  <div key={rev._id} className="review-card">
                    <div className="review-header">
                      <div className="reviewer-avatar">{rev.user?.name?.charAt(0)}</div>
                      <div>
                        <div className="reviewer-name">{rev.user?.name}</div>
                        <div className="review-date">{new Date(rev.createdAt).toLocaleDateString()}</div>
                      </div>
                      <div className="review-rating">
                        {[1,2,3,4,5].map(i => <span key={i} className={`star ${i <= rev.rating ? '' : 'empty'}`}>★</span>)}
                      </div>
                    </div>
                    <h4>{rev.title}</h4>
                    <p>{rev.content}</p>
                  </div>
                ))}
                {reviews.length === 0 && <p className="no-reviews">No reviews yet.</p>}
              </div>
            </div>
          )}

          {activeTab === 'info' && (
            <div className="detail-section">
              <h2>Contact & Hours</h2>
              <div className="info-grid">
                <div className="info-item"><span>📍</span><div><strong>Address</strong><p>{restaurant.address?.street}, {restaurant.address?.city}, {restaurant.address?.state} {restaurant.address?.zip}</p></div></div>
                {restaurant.phone && <div className="info-item"><span>📞</span><div><strong>Phone</strong><p>{restaurant.phone}</p></div></div>}
                {restaurant.website && <div className="info-item"><span>🌐</span><div><strong>Website</strong><a href={restaurant.website} target="_blank" rel="noreferrer">{restaurant.website}</a></div></div>}
              </div>
              {restaurant.hours && (
                <div className="hours-table">
                  <h3>Opening Hours</h3>
                  {Object.entries(restaurant.hours).map(([day, hours]) => hours && (
                    <div key={day} className="hours-row">
                      <span className="day">{day.charAt(0).toUpperCase() + day.slice(1)}</span>
                      <span className="hours">{hours}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Sidebar */}
        <aside className="detail-sidebar">
          <div className="sidebar-card">
            <h3>Quick Info</h3>
            <div className="quick-info">
              <div className="qi-item"><span>💰</span><span>{restaurant.priceRange} Price Range</span></div>
              <div className="qi-item"><span>🍴</span><span>{restaurant.cuisine} Cuisine</span></div>
              {restaurant.phone && <div className="qi-item"><span>📞</span><span>{restaurant.phone}</span></div>}
              {restaurant.address?.city && <div className="qi-item"><span>📍</span><span>{restaurant.address.city}, {restaurant.address.state}</span></div>}
            </div>
            {restaurant.features?.reservations && (
              <button className="btn btn-primary" style={{width:'100%', marginTop:'16px'}}>📅 Make Reservation</button>
            )}
            {restaurant.features?.delivery && (
              <button className="btn btn-secondary" style={{width:'100%', marginTop:'8px'}}>🚗 Order Delivery</button>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
};

export default RestaurantDetail;
