import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => (
  <footer className="footer">
    <div className="container">
      <div className="footer-grid">
        <div className="footer-brand">
          <div className="brand-row">🍽️ <span>DineGuide</span></div>
          <p>Discover extraordinary dining experiences. Your guide to the best restaurants, hidden gems, and culinary adventures.</p>
          <div className="social-links">
            <a href="#!" className="social-link">📘</a>
            <a href="#!" className="social-link">📸</a>
            <a href="#!" className="social-link">🐦</a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Explore</h4>
          <Link to="/restaurants">All Restaurants</Link>
          <Link to="/restaurants?category=Fine+Dining">Fine Dining</Link>
          <Link to="/restaurants?category=Casual">Casual Dining</Link>
          <Link to="/restaurants?category=Vegan">Vegan</Link>
          <Link to="/restaurants?category=Cafe">Cafes</Link>
        </div>
        <div className="footer-col">
          <h4>Account</h4>
          <Link to="/login">Sign In</Link>
          <Link to="/register">Create Account</Link>
          <Link to="/profile">My Profile</Link>
          <Link to="/profile#favorites">My Favorites</Link>
          <Link to="/add-restaurant">Add Restaurant</Link>
        </div>
        <div className="footer-col">
          <h4>Contact</h4>
          <p>📍 New York, NY 10001</p>
          <p>📞 (212) 555-DINE</p>
          <p>✉️ hello@dineguide.com</p>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 DineGuide. Built with MERN Stack ❤️</p>
        <div className="footer-links">
          <a href="#!">Privacy Policy</a>
          <a href="#!">Terms of Service</a>
          <a href="#!">Cookie Policy</a>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
