import React from 'react';
import { useNavigate } from 'react-router-dom';

const FALLBACK_IMG =
  "/no-image.png";

const MovieCard = ({ movie }) => {
  const navigate = useNavigate();

  return (
    <div className="movie-card"
         onClick={() => navigate(`/movies/${movie.id}`)}>
      <div className="movie-card-img-wrapper">
        <img
          src={movie.posterUrl || FALLBACK_IMG}
          alt={movie.title}
          onError={(e) => { e.target.src = FALLBACK_IMG; }}
          className="movie-card-img"
        />
        <div className="movie-card-overlay">
          <button className="btn-book-now">Book Now</button>
        </div>
        {movie.rating && (
          <span className="movie-rating">
            ⭐ {movie.rating}
          </span>
        )}
      </div>
      <div className="movie-card-body">
        <h3 className="movie-title">{movie.title}</h3>
        <div className="movie-meta">
          <span className="genre-badge">{movie.genre}</span>
          <span className="lang-badge">{movie.language}</span>
        </div>
        <p className="movie-duration">
          <i className="fas fa-clock"></i> {movie.duration} min
        </p>
      </div>
    </div>
  );
};

export default MovieCard;