import React, { useEffect, useState } from 'react';
import { movieAPI } from '../api/axios';
import MovieCard from '../components/MovieCard';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';

const GENRES = ['All', 'Action', 'Drama', 'Sci-Fi', 'Comedy', 'Thriller'];

const HomePage = () => {
  const [movies,   setMovies]   = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState('');
  const [genre,    setGenre]    = useState('All');

  useEffect(() => {
    fetchMovies();
  }, []);

  useEffect(() => {
    applyFilter();
  }, [movies, search, genre]);

  const fetchMovies = async () => {
    try {
      const { data } = await movieAPI.getAll();
      setMovies(data);
    } catch {
      toast.error('Failed to load movies');
    } finally {
      setLoading(false);
    }
  };

  const applyFilter = () => {
    let list = [...movies];
    if (search.trim()) {
      const kw = search.toLowerCase();
      list = list.filter(m =>
        m.title.toLowerCase().includes(kw) ||
        m.genre?.toLowerCase().includes(kw) ||
        m.language?.toLowerCase().includes(kw)
      );
    }
    if (genre !== 'All') {
      list = list.filter(m =>
        m.genre?.toLowerCase().includes(genre.toLowerCase())
      );
    }
    setFiltered(list);
  };

  if (loading) return <LoadingSpinner message="Loading movies..." />;

  return (
    <div>
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>🎬 Book Your <span>Movie Experience</span></h1>
          <p>Discover the latest blockbusters and reserve your seats instantly.</p>
          <div className="hero-search">
            <i className="fas fa-search"></i>
            <input
              type="text"
              placeholder="Search movies, genres, languages..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            {search && (
              <button onClick={() => setSearch('')} className="clear-btn">
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
        </div>
      </section>

      {/* Genre Filter */}
      <div className="genre-filter">
        {GENRES.map(g => (
          <button
            key={g}
            className={`genre-btn ${genre === g ? 'active' : ''}`}
            onClick={() => setGenre(g)}
          >
            {g}
          </button>
        ))}
      </div>

      {/* Movie Grid */}
      <section>
        <div className="section-header">
          <h2>
            {genre === 'All' ? '🔥 Now Showing' : `🎭 ${genre} Movies`}
          </h2>
          <span className="movie-count">{filtered.length} movie{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="no-results">
            <i className="fas fa-film fa-3x"></i>
            <p>No movies found for "{search || genre}"</p>
            <button className="btn-secondary"
              onClick={() => { setSearch(''); setGenre('All'); }}>
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="movies-grid">
            {filtered.map(movie => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        )}
      </section>

      <style>{`
        .hero {
          background: linear-gradient(135deg, #0f3460 0%, #16213e 50%, #1a1a2e 100%);
          padding: 5rem 2rem;
          text-align: center;
          border-bottom: 1px solid var(--border);
        }
        .hero-content h1 {
          font-size: clamp(1.8rem, 5vw, 3rem);
          font-weight: 900;
          margin-bottom: 1rem;
        }
        .hero-content h1 span { color: var(--primary); }
        .hero-content p {
          color: var(--text-secondary);
          font-size: 1.1rem;
          margin-bottom: 2rem;
        }
        .hero-search {
          display: flex;
          align-items: center;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 50px;
          padding: 0 1.2rem;
          max-width: 550px;
          margin: 0 auto;
          gap: 0.8rem;
          transition: var(--transition);
        }
        .hero-search:focus-within { border-color: var(--primary); }
        .hero-search i { color: var(--text-secondary); }
        .hero-search input {
          flex: 1;
          background: none;
          border: none;
          outline: none;
          color: var(--text-primary);
          font-size: 1rem;
          padding: 14px 0;
        }
        .clear-btn {
          background: none;
          border: none;
          color: var(--text-secondary);
          cursor: pointer;
          padding: 4px;
        }
        .clear-btn:hover { color: var(--primary); }
        .genre-filter {
          display: flex;
          gap: 0.75rem;
          padding: 1.5rem 2rem;
          overflow-x: auto;
          scrollbar-width: none;
          border-bottom: 1px solid var(--border);
        }
        .genre-filter::-webkit-scrollbar { display: none; }
        .genre-btn {
          background: var(--surface);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 8px 20px;
          border-radius: 20px;
          cursor: pointer;
          white-space: nowrap;
          font-size: 0.9rem;
          transition: var(--transition);
        }
        .genre-btn:hover,
        .genre-btn.active {
          background: var(--primary);
          border-color: var(--primary);
          color: white;
        }
        .section-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 2rem 0.5rem;
          max-width: 1400px;
          margin: 0 auto;
        }
        .section-header h2 { font-size: 1.5rem; }
        .movie-count {
          background: var(--surface);
          border: 1px solid var(--border);
          padding: 4px 14px;
          border-radius: 20px;
          font-size: 0.85rem;
          color: var(--text-secondary);
        }
        .no-results {
          text-align: center;
          padding: 5rem 2rem;
          color: var(--text-secondary);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
};

export default HomePage;