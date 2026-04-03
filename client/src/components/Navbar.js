import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => { logout(); navigate('/'); setDropdownOpen(false); };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''} ${location.pathname === '/' ? 'home-nav' : ''}`}>
      <div className="container navbar-inner">
        <Link to="/" className="brand">
          <span className="brand-icon">🍽️</span>
          <span className="brand-text">DineGuide</span>
        </Link>

        <div className={`nav-links ${menuOpen ? 'open' : ''}`}>
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/restaurants" className="nav-link">Restaurants</Link>
          {user && <Link to="/add-restaurant" className="nav-link">Add Restaurant</Link>}
          {!user ? (
            <>
              <Link to="/login" className="btn btn-ghost btn-sm">Sign In</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Get Started</Link>
            </>
          ) : (
            <div className="user-menu">
              <button className="user-btn" onClick={() => setDropdownOpen(!dropdownOpen)}>
                <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
                <span>{user.name.split(' ')[0]}</span>
                <span className="chevron">▾</span>
              </button>
              {dropdownOpen && (
                <div className="dropdown">
                  <Link to="/profile" className="dropdown-item" onClick={() => setDropdownOpen(false)}>👤 Profile</Link>
                  <Link to="/profile#favorites" className="dropdown-item" onClick={() => setDropdownOpen(false)}>❤️ Favorites</Link>
                  <hr />
                  <button className="dropdown-item danger" onClick={handleLogout}>🚪 Sign Out</button>
                </div>
              )}
            </div>
          )}
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
          <span className={menuOpen ? 'x' : ''}></span>
          <span className={menuOpen ? 'x' : ''}></span>
          <span className={menuOpen ? 'x' : ''}></span>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
