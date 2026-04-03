import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';
import './Home.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CATEGORIES = [
  { label: 'Fine Dining', icon: '🥂', value: 'Fine Dining' },
  { label: 'Casual', icon: '🍔', value: 'Casual' },
  { label: 'Vegan', icon: '🥗', value: 'Vegan' },
  { label: 'Seafood', icon: '🦞', value: 'Seafood' },
  { label: 'Cafe', icon: '☕', value: 'Cafe' },
  { label: 'Fast Food', icon: '🍟', value: 'Fast Food' },
  { label: 'Buffet', icon: '🍱', value: 'Buffet' },
  { label: 'Street Food', icon: '🌮', value: 'Street Food' },
];

const STATS = [
  { value: '500+', label: 'Restaurants', icon: '🏪' },
  { value: '10K+', label: 'Reviews', icon: '⭐' },
  { value: '50+', label: 'Cuisines', icon: '🌍' },
  { value: '99%', label: 'Happy Diners', icon: '😊' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Seed and fetch featured restaurants
    const init = async () => {
      try {
        await axios.post(`${API}/restaurants/seed/sample`).catch(() => {});
        const { data } = await axios.get(`${API}/restaurants/featured`);
        setFeatured(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/restaurants?search=${encodeURIComponent(search)}`);
  };

  return (
    <div className="home">
      {/* Hero */}
      <section className="hero">
        <div className="hero-overlay"></div>
        <div className="hero-content container">
          <div className="hero-badge">✨ Discover Your Next Favorite Spot</div>
          <h1 className="hero-title">
            Find the Perfect<br />
            <span className="hero-accent">Dining Experience</span>
          </h1>
          <p className="hero-sub">Explore curated restaurants, read authentic reviews, and book your next unforgettable meal.</p>
          <form className="hero-search" onSubmit={handleSearch}>
            <span className="search-icon">🔍</span>
            <input
              type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search restaurants, cuisine, or location..."
              className="search-input"
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
          <div className="hero-tags">
            <span>Popular:</span>
            {['Italian', 'Sushi', 'Vegan', 'Fine Dining', 'Pizza'].map(tag => (
              <button key={tag} className="hero-tag" onClick={() => navigate(`/restaurants?search=${tag}`)}>{tag}</button>
            ))}
          </div>
        </div>
        <div className="hero-scroll-hint">
          <span>Scroll to explore</span>
          <div className="scroll-arrow">↓</div>
        </div>
      </section>

      {/* Stats */}
      <section className="stats-bar">
        <div className="container stats-grid">
          {STATS.map((s, i) => (
            <div key={i} className="stat-item">
              <span className="stat-icon">{s.icon}</span>
              <div>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Categories */}
      <section className="section categories-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Browse by Category</h2>
            <p className="section-subtitle">Find exactly what you're craving from our wide range of dining options</p>
          </div>
          <div className="categories-grid">
            {CATEGORIES.map(cat => (
              <Link key={cat.value} to={`/restaurants?category=${encodeURIComponent(cat.value)}`} className="category-card">
                <div className="category-icon">{cat.icon}</div>
                <span>{cat.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured */}
      <section className="section featured-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">Featured Restaurants</h2>
            <p className="section-subtitle">Hand-picked by our team for exceptional quality and experience</p>
          </div>
          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : (
            <div className="grid-3">
              {featured.map(r => <RestaurantCard key={r._id} restaurant={r} />)}
            </div>
          )}
          <div className="text-center mt-3">
            <Link to="/restaurants" className="btn btn-secondary btn-lg">View All Restaurants →</Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-inner">
          <div className="cta-text">
            <h2>Own a Restaurant?</h2>
            <p>List your restaurant on DineGuide and reach thousands of hungry diners looking for their next great meal.</p>
            <Link to="/add-restaurant" className="btn btn-primary btn-lg">Add Your Restaurant Free →</Link>
          </div>
          <div className="cta-image">🍴</div>
        </div>
      </section>
    </div>
  );
};

export default Home;
