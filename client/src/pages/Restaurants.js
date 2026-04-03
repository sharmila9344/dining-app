import React, { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import RestaurantCard from '../components/RestaurantCard';
import './Restaurants.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const CATEGORIES = ['Fine Dining', 'Casual', 'Fast Food', 'Cafe', 'Street Food', 'Buffet', 'Vegan', 'Seafood'];
const PRICE_RANGES = ['$', '$$', '$$$', '$$$$'];
const SORT_OPTIONS = [
  { value: '-createdAt', label: 'Newest' },
  { value: '-rating', label: 'Top Rated' },
  { value: '-reviewCount', label: 'Most Reviewed' },
  { value: 'priceRange', label: 'Price: Low to High' },
];

const Restaurants = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [filters, setFilters] = useState({
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    priceRange: '',
    rating: '',
    sort: '-rating',
    page: 1
  });
  const [searchInput, setSearchInput] = useState(searchParams.get('search') || '');

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      const params = Object.fromEntries(Object.entries(filters).filter(([, v]) => v !== ''));
      const { data } = await axios.get(`${API}/restaurants`, { params });
      setRestaurants(data.restaurants);
      setTotal(data.total);
      setPages(data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => { fetchRestaurants(); }, [fetchRestaurants]);

  const updateFilter = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value, page: 1 }));
  };

  const handleSearch = (e) => {
    e.preventDefault();
    updateFilter('search', searchInput);
    setSearchParams({ search: searchInput });
  };

  const clearFilters = () => {
    setFilters({ search: '', category: '', priceRange: '', rating: '', sort: '-rating', page: 1 });
    setSearchInput('');
    setSearchParams({});
  };

  const hasFilters = filters.search || filters.category || filters.priceRange || filters.rating;

  return (
    <div className="restaurants-page">
      <div className="page-hero">
        <div className="container">
          <h1>Discover Restaurants</h1>
          <p>Find your perfect dining experience from our curated collection</p>
          <form className="search-bar" onSubmit={handleSearch}>
            <span>🔍</span>
            <input
              type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Search by name, cuisine, or keyword..."
            />
            <button type="submit" className="btn btn-primary">Search</button>
          </form>
        </div>
      </div>

      <div className="container restaurants-layout">
        {/* Sidebar Filters */}
        <aside className="filters-sidebar">
          <div className="filters-header">
            <h3>Filters</h3>
            {hasFilters && <button className="clear-link" onClick={clearFilters}>Clear all</button>}
          </div>

          <div className="filter-group">
            <label>Category</label>
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                className={`filter-chip ${filters.category === cat ? 'active' : ''}`}
                onClick={() => updateFilter('category', filters.category === cat ? '' : cat)}
              >{cat}</button>
            ))}
          </div>

          <div className="filter-group">
            <label>Price Range</label>
            <div className="price-chips">
              {PRICE_RANGES.map(p => (
                <button
                  key={p}
                  className={`price-chip ${filters.priceRange === p ? 'active' : ''}`}
                  onClick={() => updateFilter('priceRange', filters.priceRange === p ? '' : p)}
                >{p}</button>
              ))}
            </div>
          </div>

          <div className="filter-group">
            <label>Minimum Rating</label>
            {[4, 3, 2].map(r => (
              <button
                key={r}
                className={`filter-chip ${filters.rating === String(r) ? 'active' : ''}`}
                onClick={() => updateFilter('rating', filters.rating === String(r) ? '' : String(r))}
              >{'★'.repeat(r)}{'☆'.repeat(5 - r)} & up</button>
            ))}
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={filters.sort} onChange={e => updateFilter('sort', e.target.value)} className="form-control">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>
        </aside>

        {/* Results */}
        <main className="results-area">
          <div className="results-header">
            <p className="results-count">
              {loading ? 'Loading...' : `${total} restaurant${total !== 1 ? 's' : ''} found`}
            </p>
          </div>

          {loading ? (
            <div className="loading-center"><div className="spinner"></div></div>
          ) : restaurants.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">🍽️</div>
              <h3>No restaurants found</h3>
              <p>Try adjusting your filters or search query</p>
              <button className="btn btn-primary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <>
              <div className="results-grid">
                {restaurants.map(r => <RestaurantCard key={r._id} restaurant={r} />)}
              </div>
              {pages > 1 && (
                <div className="pagination">
                  {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                    <button
                      key={p}
                      className={`page-btn ${filters.page === p ? 'active' : ''}`}
                      onClick={() => setFilters(prev => ({ ...prev, page: p }))}
                    >{p}</button>
                  ))}
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default Restaurants;
