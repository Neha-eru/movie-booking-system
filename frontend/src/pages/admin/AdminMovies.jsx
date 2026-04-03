import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { toast } from 'react-toastify';

const EMPTY_FORM = {
  title:'', description:'', genre:'', duration:'',
  language:'', rating:'', posterUrl:'', releaseDate:'', isActive: true
};

const AdminMovies = () => {
  const [movies,  setMovies]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [showForm,setShowForm]= useState(false);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => { fetchMovies(); }, []);

  const fetchMovies = async () => {
    try {
      const { data } = await adminAPI.getAllMovies();
      setMovies(data);
    } catch { toast.error('Failed to load movies'); }
    finally  { setLoading(false); }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
  };

  const openAdd = () => {
    setForm(EMPTY_FORM); setEditing(null); setShowForm(true);
  };

  const openEdit = (movie) => {
    setForm({
      title:       movie.title       || '',
      description: movie.description || '',
      genre:       movie.genre       || '',
      duration:    movie.duration    || '',
      language:    movie.language    || '',
      rating:      movie.rating      || '',
      posterUrl:   movie.posterUrl   || '',
      releaseDate: movie.releaseDate || '',
      isActive:    movie.isActive    ?? true,
    });
    setEditing(movie.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title) { toast.error('Title is required'); return; }
    setSaving(true);
    try {
      if (editing) {
        await adminAPI.updateMovie(editing, form);
        toast.success('Movie updated!');
      } else {
        await adminAPI.addMovie(form);
        toast.success('Movie added!');
      }
      setShowForm(false);
      fetchMovies();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Deactivate "${title}"?`)) return;
    try {
      await adminAPI.deleteMovie(id);
      toast.success('Movie deactivated');
      fetchMovies();
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <LoadingSpinner message="Loading movies..." />;

  return (
    <div className="admin-movies-page">
      <div className="admin-header">
        <div>
          <h1>🎬 Manage Movies</h1>
          <p>{movies.length} movies in the system</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <i className="fas fa-plus"></i> Add Movie
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Movie' : 'Add New Movie'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="movie-form">
              <div className="form-grid">
                <div className="form-group">
                  <label>Title *</label>
                  <input name="title" value={form.title}
                         onChange={handleChange} placeholder="Movie title" />
                </div>
                <div className="form-group">
                  <label>Genre</label>
                  <input name="genre" value={form.genre}
                         onChange={handleChange} placeholder="Action, Drama..." />
                </div>
                <div className="form-group">
                  <label>Language</label>
                  <input name="language" value={form.language}
                         onChange={handleChange} placeholder="English, Hindi..." />
                </div>
                <div className="form-group">
                  <label>Duration (min)</label>
                  <input type="number" name="duration" value={form.duration}
                         onChange={handleChange} placeholder="120" />
                </div>
                <div className="form-group">
                  <label>Rating</label>
                  <input type="number" step="0.1" min="0" max="10"
                         name="rating" value={form.rating}
                         onChange={handleChange} placeholder="8.5" />
                </div>
                <div className="form-group">
                  <label>Release Date</label>
                  <input type="date" name="releaseDate" value={form.releaseDate}
                         onChange={handleChange} />
                </div>
                <div className="form-group span-2">
                  <label>Poster URL</label>
                  <input name="posterUrl" value={form.posterUrl}
                         onChange={handleChange} placeholder="https://..." />
                </div>
                <div className="form-group span-2">
                  <label>Description</label>
                  <textarea name="description" value={form.description}
                            onChange={handleChange} rows={3}
                            placeholder="Movie synopsis..." />
                </div>
                <div className="form-group checkbox-group">
                  <label>
                    <input type="checkbox" name="isActive"
                           checked={form.isActive} onChange={handleChange} />
                    &nbsp; Active (visible to users)
                  </label>
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary"
                        onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving
                    ? <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                    : editing ? 'Update Movie' : 'Add Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Movies Table */}
      <div className="container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Poster</th>
                <th>Title</th>
                <th>Genre</th>
                <th>Language</th>
                <th>Duration</th>
                <th>Rating</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {movies.map(movie => (
                <tr key={movie.id}>
                  <td>
                    <img
                      src={movie.posterUrl || 'https://via.placeholder.com/50x70/1a1a2e/e94560?text=N/A'}
                      alt={movie.title}
                      className="table-poster"
                      onError={e => {
                        e.target.src='https://via.placeholder.com/50x70/1a1a2e/e94560?text=N/A';
                      }}
                    />
                  </td>
                  <td><strong>{movie.title}</strong></td>
                  <td>{movie.genre}</td>
                  <td>{movie.language}</td>
                  <td>{movie.duration} min</td>
                  <td>⭐ {movie.rating}</td>
                  <td>
                    <span className={`status-dot ${movie.isActive ? 'active' : 'inactive'}`}>
                      {movie.isActive ? '● Active' : '● Inactive'}
                    </span>
                  </td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon edit"
                              onClick={() => openEdit(movie)} title="Edit">
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn-icon delete"
                              onClick={() => handleDelete(movie.id, movie.title)}
                              title="Deactivate">
                        <i className="fas fa-trash"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style>{`
        .admin-movies-page { min-height: calc(100vh - 70px); }
        .admin-header {
          display: flex; justify-content: space-between; align-items: center;
          padding: 2rem; background: var(--surface);
          border-bottom: 1px solid var(--border);
          flex-wrap: wrap; gap: 1rem;
        }
        .admin-header h1 { font-size: 1.8rem; margin-bottom: 0.2rem; }
        .admin-header p  { color: var(--text-secondary); }
        .table-wrapper { overflow-x: auto; margin-top: 2rem; border-radius: 14px; }
        .data-table {
          width: 100%; border-collapse: collapse;
          background: var(--surface); border: 1px solid var(--border);
        }
        .data-table th, .data-table td {
          padding: 12px 16px; text-align: left;
          border-bottom: 1px solid var(--border); font-size: 0.9rem;
        }
        .data-table th {
          background: var(--surface-light);
          color: var(--text-secondary); font-size: 0.78rem;
          text-transform: uppercase; letter-spacing: 1px;
        }
        .data-table tbody tr:hover { background: var(--surface-light); }
        .table-poster {
          width: 40px; height: 58px; object-fit: cover;
          border-radius: 6px;
        }
        .status-dot { font-size: 0.82rem; font-weight: 600; }
        .status-dot.active   { color: var(--success); }
        .status-dot.inactive { color: var(--danger); }
        .table-actions { display: flex; gap: 0.5rem; }
        .btn-icon {
          background: none; border: 1px solid;
          padding: 6px 10px; border-radius: 8px;
          cursor: pointer; transition: var(--transition); font-size: 0.85rem;
        }
        .btn-icon.edit   { border-color: #0984e3; color: #0984e3; }
        .btn-icon.delete { border-color: var(--danger); color: var(--danger); }
        .btn-icon.edit:hover   { background: #0984e3; color: white; }
        .btn-icon.delete:hover { background: var(--danger); color: white; }
        .modal-overlay {
          position: fixed; inset: 0;
          background: rgba(0,0,0,0.7);
          display: flex; align-items: center;
          justify-content: center; z-index: 2000;
          padding: 1rem;
        }
        .modal-box {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          width: 100%; max-width: 660px;
          max-height: 90vh; overflow-y: auto;
        }
        .modal-header {
          display: flex; justify-content: space-between;
          align-items: center; padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        .modal-header h2 { font-size: 1.3rem; }
        .modal-close {
          background: none; border: none;
          color: var(--text-secondary); font-size: 1.2rem;
          cursor: pointer; padding: 4px 8px;
        }
        .modal-close:hover { color: var(--primary); }
        .movie-form { padding: 1.5rem; }
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem; margin-bottom: 1rem;
        }
        .form-grid .form-group textarea { resize: vertical; }
        .span-2 { grid-column: span 2; }
        .checkbox-group label {
          display: flex; align-items: center;
          color: var(--text-primary); cursor: pointer;
        }
        .modal-actions {
          display: flex; justify-content: flex-end;
          gap: 1rem; padding-top: 1rem;
          border-top: 1px solid var(--border);
        }
        @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } .span-2 { grid-column: span 1; } }
      `}</style>
    </div>
  );
};

export default AdminMovies;