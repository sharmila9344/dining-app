import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './RestaurantCard.css';

const Stars = ({ rating }) => (
  <div className="stars">
    {[1,2,3,4,5].map(i => (
      <span key={i} className={`star ${i <= Math.round(rating) ? '' : 'empty'}`}>★</span>
    ))}
  </div>
);

const RestaurantCard = ({ restaurant }) => {
  const { user, toggleFavorite } = useAuth();
  const isFav = user?.favorites?.includes(restaurant._id);

  const handleFav = (e) => {
    e.preventDefault(); e.stopPropagation();
    toggleFavorite(restaurant._id);
  };

  return (
    <Link to={`/restaurants/${restaurant._id}`} className="restaurant-card card">
      <div className="card-img-wrapper">
        <img
          src={restaurant.image}
          alt={restaurant.name}
          onError={e => { e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'; }}
        />
        <div className="card-badges">
          <span className="badge badge-accent">{restaurant.priceRange}</span>
          <span className="badge badge-primary">{restaurant.category}</span>
        </div>
        {user && (
          <button className={`fav-btn ${isFav ? 'active' : ''}`} onClick={handleFav} title={isFav ? 'Remove favorite' : 'Add to favorites'}>
            {isFav ? '❤️' : '🤍'}
          </button>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{restaurant.name}</h3>
        <p className="card-cuisine">{restaurant.cuisine} · {restaurant.address?.city}</p>
        <div className="card-rating">
          <Stars rating={restaurant.rating} />
          <span className="rating-num">{restaurant.rating.toFixed(1)}</span>
          <span className="review-count">({restaurant.reviewCount} reviews)</span>
        </div>
        <p className="card-desc">{restaurant.description?.slice(0, 90)}...</p>
        <div className="card-features">
          {restaurant.features?.delivery && <span className="feature-tag">🚗 Delivery</span>}
          {restaurant.features?.dineIn && <span className="feature-tag">🍽️ Dine In</span>}
          {restaurant.features?.reservations && <span className="feature-tag">📅 Reservations</span>}
          {restaurant.features?.outdoor && <span className="feature-tag">🌿 Outdoor</span>}
        </div>
      </div>
    </Link>
  );
};

export default RestaurantCard;
