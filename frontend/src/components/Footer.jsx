import React from 'react';

const Footer = () => (
  <footer className="footer">
    <div className="footer-content">
      <div className="footer-brand">
        🎬 <strong>CineBook</strong>
        <p>Your ultimate movie ticket booking experience.</p>
      </div>
      <div className="footer-links">
        <h5>Quick Links</h5>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/login">Login</a></li>
          <li><a href="/register">Register</a></li>
        </ul>
      </div>
      <div className="footer-info">
        <h5>Contact</h5>
        <p><i className="fas fa-envelope"></i> support@cinebook.com</p>
        <p><i className="fas fa-phone"></i> +91 98765 43210</p>
      </div>
    </div>
    <div className="footer-bottom">
      <p>© {new Date().getFullYear()} CineBook. All rights reserved.</p>
    </div>
  </footer>
);

export default Footer;