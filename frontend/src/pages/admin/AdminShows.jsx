import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency, formatDate, formatTime } from '../../utils/helpers';
import { toast } from 'react-toastify';
import axios from 'axios';

const EMPTY_FORM = {
  movieId:'', showDate:'', showTime:'',
  hallName:'', totalSeats:60, ticketPrice:''
};

const AdminShows = () => {
  const [shows,   setShows]   = useState([]);
  const [movies,  setMovies]  = useState([]);
  const [loading, setLoading] = useState(true);
  const [form,    setForm]    = useState(EMPTY_FORM);
  const [editing, setEditing] = useState(null);
  const [showForm,setShowForm]= useState(false);
  const [saving,  setSaving]  = useState(false);

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const showsRes = await adminAPI.getAllShows();
const moviesRes = await axios.get('http://movie-booking-system-ja3o.onrender.com/api/movies');

console.log("Movies:", moviesRes.data); // debug

setShows(showsRes.data);
setMovies(moviesRes.data);
      setShows(showsRes.data);
      setMovies(moviesRes.data);
    } catch { toast.error('Failed to load data'); }
    finally  { setLoading(false); }
  };

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const openAdd = () => {
    setForm(EMPTY_FORM); setEditing(null); setShowForm(true);
  };

  const openEdit = (show) => {
    setForm({
      movieId:     show.movieId     || '',
      showDate:    show.showDate    || '',
      showTime:    show.showTime?.substring(0,5) || '',
      hallName:    show.hallName    || '',
      totalSeats:  show.totalSeats  || 60,
      ticketPrice: show.ticketPrice || '',
    });
    setEditing(show.id);
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.movieId || !form.showDate || !form.showTime) {
      toast.error('Movie, date and time are required'); return;
    }
    setSaving(true);
    try {
      if (editing) {
        await adminAPI.updateShow(editing, form);
        toast.success('Show updated!');
      } else {
        await adminAPI.addShow(form);
        toast.success('Show added! Seats generated automatically.');
      }
      setShowForm(false);
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Operation failed');
    } finally { setSaving(false); }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this show? All seat data will be removed.')) return;
    try {
      await adminAPI.deleteShow(id);
      toast.success('Show deleted');
      fetchData();
    } catch { toast.error('Delete failed'); }
  };

  if (loading) return <LoadingSpinner message="Loading shows..." />;

  return (
    <div className="admin-shows-page">
      <div className="admin-header">
        <div>
          <h1>📽️ Manage Shows</h1>
          <p>{shows.length} shows scheduled</p>
        </div>
        <button className="btn-primary" onClick={openAdd}>
          <i className="fas fa-plus"></i> Add Show
        </button>
      </div>

      {/* Modal Form */}
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-box" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editing ? 'Edit Show' : 'Add New Show'}</h2>
              <button className="modal-close" onClick={() => setShowForm(false)}>✕</button>
            </div>
            <form onSubmit={handleSubmit} className="movie-form">
              <div className="form-grid">
                <div className="form-group span-2">
                  <label>Movie *</label>
                  <select name="movieId" value={form.movieId} onChange={handleChange}>
                    <option value="">— Select Movie —</option>
                    {movies.map(m => (
                      <option key={m.id} value={m.id}>{m.title}</option>
                    ))}
                  </select>
                </div>
                <div className="form-group">
                  <label>Show Date *</label>
                  <input type="date" name="showDate" value={form.showDate}
                         onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Show Time *</label>
                  <input type="time" name="showTime" value={form.showTime}
                         onChange={handleChange} />
                </div>
                <div className="form-group">
                  <label>Hall Name</label>
                  <input name="hallName" value={form.hallName}
                         onChange={handleChange} placeholder="Hall A" />
                </div>
                <div className="form-group">
                  <label>Total Seats</label>
                  <input type="number" name="totalSeats" value={form.totalSeats}
                         onChange={handleChange} placeholder="60"
                         disabled={!!editing} />
                  {editing && (
                    <small style={{color:'var(--text-secondary)'}}>
                      Seats cannot be changed after creation.
                    </small>
                  )}
                </div>
                <div className="form-group span-2">
                  <label>Ticket Price (₹)</label>
                  <input type="number" step="0.01" name="ticketPrice"
                         value={form.ticketPrice}
                         onChange={handleChange} placeholder="250.00" />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" className="btn-secondary"
                        onClick={() => setShowForm(false)}>Cancel</button>
                <button type="submit" className="btn-primary" disabled={saving}>
                  {saving
                    ? <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                    : editing ? 'Update Show' : 'Add Show'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Shows Table */}
      <div className="container">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>Movie</th>
                <th>Date</th>
                <th>Time</th>
                <th>Hall</th>
                <th>Total Seats</th>
                <th>Available</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {shows.map(show => (
                <tr key={show.id}>
                  <td><strong>{show.movieTitle}</strong></td>
                  <td>{formatDate(show.showDate)}</td>
                  <td>{formatTime(show.showTime)}</td>
                  <td>{show.hallName}</td>
                  <td>{show.totalSeats}</td>
                  <td>
                    <span className={
                      show.availableSeats === 0   ? 'seats-full'
                    : show.availableSeats < 10    ? 'seats-few'
                    :                               'seats-ok'
                    }>
                      {show.availableSeats === 0
                        ? '🔴 Full'
                        : `${show.availableSeats} left`}
                    </span>
                  </td>
                  <td>{formatCurrency(show.ticketPrice)}</td>
                  <td>
                    <div className="table-actions">
                      <button className="btn-icon edit"
                              onClick={() => openEdit(show)}>
                        <i className="fas fa-edit"></i>
                      </button>
                      <button className="btn-icon delete"
                              onClick={() => handleDelete(show.id)}>
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
        .admin-shows-page { min-height: calc(100vh - 70px); }
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
        .seats-ok   { color: var(--success); font-weight: 600; }
        .seats-few  { color: var(--warning); font-weight: 600; }
        .seats-full { color: var(--danger);  font-weight: 600; }
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
          position: fixed; inset: 0; background: rgba(0,0,0,0.7);
          display: flex; align-items: center;
          justify-content: center; z-index: 2000; padding: 1rem;
        }
        .modal-box {
          background: var(--surface); border: 1px solid var(--border);
          border-radius: 20px; width: 100%; max-width: 560px;
          max-height: 90vh; overflow-y: auto;
        }
        .modal-header {
          display: flex; justify-content: space-between;
          align-items: center; padding: 1.5rem;
          border-bottom: 1px solid var(--border);
        }
        .modal-close {
          background: none; border: none;
          color: var(--text-secondary); font-size: 1.2rem; cursor: pointer;
        }
        .modal-close:hover { color: var(--primary); }
        .movie-form { padding: 1.5rem; }
        .form-grid {
          display: grid; grid-template-columns: 1fr 1fr;
          gap: 1rem; margin-bottom: 1rem;
        }
        .span-2 { grid-column: span 2; }
        .modal-actions {
          display: flex; justify-content: flex-end; gap: 1rem;
          padding-top: 1rem; border-top: 1px solid var(--border);
        }
        @media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } .span-2 { grid-column: span 1; } }
      `}</style>
    </div>
  );
};

export default AdminShows;