import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Navbar = () => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    toast.success('Logged out successfully!');
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          🎬 <span className="brand-name">CineBook</span>
        </Link>
      </div>

      <button
        className="navbar-toggle"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Toggle menu"
      >
        <i className={`fas ${menuOpen ? 'fa-times' : 'fa-bars'}`}></i>
      </button>

      <ul className={`navbar-links ${menuOpen ? 'open' : ''}`}>
        <li><Link to="/" onClick={() => setMenuOpen(false)}>
          <i className="fas fa-film"></i> Movies
        </Link></li>

        {isAuthenticated && !isAdmin && (
          <li><Link to="/bookings/history" onClick={() => setMenuOpen(false)}>
            <i className="fas fa-ticket-alt"></i> My Bookings
          </Link></li>
        )}

        {isAdmin && (
          <li className="dropdown">
            <Link to="/admin" onClick={() => setMenuOpen(false)}>
              <i className="fas fa-cog"></i> Admin
            </Link>
            <ul className="dropdown-menu">
              <li><Link to="/admin/movies" onClick={() => setMenuOpen(false)}>
                Manage Movies
              </Link></li>
              <li><Link to="/admin/shows" onClick={() => setMenuOpen(false)}>
                Manage Shows
              </Link></li>
            </ul>
          </li>
        )}

        {isAuthenticated ? (
          <>
            <li className="nav-user">
              <i className="fas fa-user-circle"></i> {user?.username}
            </li>
            <li>
              <button className="btn-logout" onClick={handleLogout}>
                <i className="fas fa-sign-out-alt"></i> Logout
              </button>
            </li>
          </>
        ) : (
          <>
            <li><Link to="/login" onClick={() => setMenuOpen(false)}>
              <i className="fas fa-sign-in-alt"></i> Login
            </Link></li>
            <li><Link to="/register" className="btn-register"
                      onClick={() => setMenuOpen(false)}>
              Register
            </Link></li>
          </>
        )}
      </ul>
    </nav>
  );
};

export default Navbar;