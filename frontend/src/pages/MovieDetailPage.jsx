import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { movieAPI, showAPI } from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatDate, formatTime, formatCurrency } from '../utils/helpers';
import { toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';

const FALLBACK_IMG =
  'https://via.placeholder.com/400x600/1a1a2e/e94560?text=No+Poster';

const MovieDetailPage = () => {
  const { id }       = useParams();
  const navigate     = useNavigate();
  const { isAuthenticated } = useAuth();

  const [movie,   setMovie]   = useState(null);
  const [shows,   setShows]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [movieRes, showsRes] = await Promise.all([
          movieAPI.getById(id),
          showAPI.getByMovie(id),
        ]);
        setMovie(movieRes.data);
        setShows(showsRes.data);
      } catch {
        toast.error('Failed to load movie details');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleSelectShow = (show) => {
    if (!isAuthenticated) {
      toast.info('Please login to book tickets');
      navigate('/login');
      return;
    }
    navigate(`/shows/${show.id}/seats`, { state: { show, movie } });
  };

  if (loading) return <LoadingSpinner message="Loading movie details..." />;
  if (!movie)  return <div style={{textAlign:'center',padding:'4rem'}}>Movie not found.</div>;

  return (
    <div className="movie-detail-page">
      {/* Backdrop */}
      <div className="detail-backdrop"
           style={{ backgroundImage: `url(${movie.posterUrl || FALLBACK_IMG})` }}>
        <div className="backdrop-overlay" />
      </div>

      {/* Movie Info */}
      <div className="detail-content container">
        <div className="detail-layout">
          <div className="detail-poster">
            <img
              src={movie.posterUrl || FALLBACK_IMG}
              alt={movie.title}
              onError={e => { e.target.src = FALLBACK_IMG; }}
            />
          </div>

          <div className="detail-info">
            <h1 className="detail-title">{movie.title}</h1>

            <div className="detail-badges">
              <span className="genre-badge">{movie.genre}</span>
              <span className="lang-badge">{movie.language}</span>
              {movie.rating && (
                <span className="rating-badge">⭐ {movie.rating} / 10</span>
              )}
            </div>

            <div className="detail-meta">
              <div className="meta-item">
                <i className="fas fa-clock"></i>
                <span>{movie.duration} minutes</span>
              </div>
              <div className="meta-item">
                <i className="fas fa-calendar"></i>
                <span>{formatDate(movie.releaseDate)}</span>
              </div>
            </div>

            <div className="detail-description">
              <h3>Synopsis</h3>
              <p>{movie.description}</p>
            </div>
          </div>
        </div>

        {/* Show Timings */}
        <div className="shows-section">
          <h2>🕐 Available Shows</h2>
          {shows.length === 0 ? (
            <div className="no-shows">
              <i className="fas fa-calendar-times fa-2x"></i>
              <p>No shows available at the moment.</p>
            </div>
          ) : (
            <div className="shows-grid">
              {shows.map(show => (
                <div key={show.id} className="show-card">
                  <div className="show-date">
                    <i className="fas fa-calendar-day"></i>
                    {formatDate(show.showDate)}
                  </div>
                  <div className="show-time">
                    <i className="fas fa-clock"></i>
                    {formatTime(show.showTime)}
                  </div>
                  <div className="show-hall">
                    <i className="fas fa-film"></i> {show.hallName}
                  </div>
                  <div className="show-seats">
                    <span className={show.availableSeats < 10 ? 'few-left' : ''}>
                      {show.availableSeats} seats left
                    </span>
                  </div>
                  <div className="show-price">
                    {formatCurrency(show.ticketPrice)}
                  </div>
                  <button
                    className="btn-primary"
                    onClick={() => handleSelectShow(show)}
                    disabled={show.availableSeats === 0}
                  >
                    {show.availableSeats === 0
                      ? 'Housefull 🔴'
                      : 'Select Seats'}
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .movie-detail-page { position: relative; }
        .detail-backdrop {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background-size: cover; background-position: center;
          filter: blur(12px) brightness(0.2);
          z-index: 0;
        }
        .backdrop-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(to bottom, rgba(26,26,46,0.7), #1a1a2e);
        }
        .detail-content { position: relative; z-index: 1; padding-top: 3rem; }
        .detail-layout { display: flex; gap: 3rem; flex-wrap: wrap; margin-bottom: 4rem; }
        .detail-poster { flex-shrink: 0; }
        .detail-poster img {
          width: 280px; border-radius: 16px;
          box-shadow: 0 20px 60px rgba(0,0,0,0.6);
        }
        .detail-info { flex: 1; min-width: 280px; }
        .detail-title { font-size: clamp(1.8rem,4vw,2.8rem); font-weight: 900; margin-bottom: 1rem; }
        .detail-badges { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 1.5rem; }
        .rating-badge {
          background: rgba(253,203,110,0.2); color: #fdcb6e;
          padding: 4px 14px; border-radius: 20px; font-size: 0.85rem; font-weight: 600;
        }
        .detail-meta { display: flex; gap: 2rem; margin-bottom: 2rem; flex-wrap: wrap; }
        .meta-item { display: flex; align-items: center; gap: 8px; color: var(--text-secondary); }
        .meta-item i { color: var(--primary); }
        .detail-description h3 { font-size: 1.1rem; margin-bottom: 0.5rem; color: var(--primary); }
        .detail-description p { color: var(--text-secondary); line-height: 1.8; }
        .shows-section { margin-bottom: 4rem; }
        .shows-section h2 { font-size: 1.6rem; margin-bottom: 1.5rem; }
        .shows-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1rem;
        }
        .show-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px;
          padding: 1.2rem;
          display: flex; flex-direction: column; gap: 0.6rem;
          transition: var(--transition);
        }
        .show-card:hover { border-color: var(--primary); }
        .show-date, .show-time, .show-hall {
          color: var(--text-secondary); font-size: 0.9rem;
          display: flex; align-items: center; gap: 6px;
        }
        .show-date i, .show-time i, .show-hall i { color: var(--primary); }
        .show-seats { font-size: 0.85rem; color: var(--success); }
        .few-left { color: var(--danger) !important; font-weight: 600; }
        .show-price { font-size: 1.2rem; font-weight: 700; color: var(--primary); }
        .no-shows {
          text-align: center; padding: 3rem;
          color: var(--text-secondary);
          display: flex; flex-direction: column; align-items: center; gap: 1rem;
        }
        @media (max-width: 768px) {
          .detail-poster img { width: 100%; max-width: 300px; margin: 0 auto; display: block; }
        }
      `}</style>
    </div>
  );
};

export default MovieDetailPage;