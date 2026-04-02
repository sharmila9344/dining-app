import React, { useState, useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import RestaurantCard from '../components/RestaurantCard';
import './Profile.css';

const API = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const Profile = () => {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('favorites');
  const [favorites, setFavorites] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [favLoading, setFavLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    setFavLoading(true);
    try {
      if (user.favorites?.length > 0) {
        const promises = user.favorites.map(id => axios.get(`${API}/restaurants/${id}`).catch(() => null));
        const results = await Promise.all(promises);
        setFavorites(results.filter(Boolean).map(r => r.data));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) return <div className="loading-center" style={{paddingTop:'120px'}}><div className="spinner"></div></div>;
  if (!user) return <Navigate to="/login" />;

  return (
    <div className="profile-page">
      <div className="profile-hero">
        <div className="container">
          <div className="profile-header">
            <div className="profile-avatar-lg">{user.name.charAt(0).toUpperCase()}</div>
            <div className="profile-info">
              <h1>{user.name}</h1>
              <p>{user.email}</p>
              <div className="profile-stats">
                <div className="prof-stat"><strong>{user.favorites?.length || 0}</strong><span>Saved</span></div>
                <div className="prof-stat"><strong>{myReviews.length}</strong><span>Reviews</span></div>
                <div className="prof-stat"><span className="badge badge-green">{user.role}</span></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container profile-body">
        <div className="profile-tabs">
          {['favorites', 'reviews'].map(tab => (
            <button key={tab} className={`tab-btn ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
              {tab === 'favorites' ? `❤️ Favorites (${user.favorites?.length || 0})` : `⭐ My Reviews`}
            </button>
          ))}
        </div>

        {activeTab === 'favorites' && (
          <div>
            {favLoading ? (
              <div className="loading-center"><div className="spinner"></div></div>
            ) : favorites.length === 0 ? (
              <div className="empty-state text-center">
                <div className="empty-icon">🤍</div>
                <h3>No saved restaurants yet</h3>
                <p>Browse restaurants and tap the heart icon to save your favorites!</p>
                <Link to="/restaurants" className="btn btn-primary mt-2">Discover Restaurants</Link>
              </div>
            ) : (
              <div className="grid-3">
                {favorites.map(r => <RestaurantCard key={r._id} restaurant={r} />)}
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="empty-state text-center">
            <div className="empty-icon">✍️</div>
            <h3>No reviews yet</h3>
            <p>Share your dining experiences with the community!</p>
            <Link to="/restaurants" className="btn btn-primary mt-2">Find a Restaurant to Review</Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
