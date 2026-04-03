import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { adminAPI, movieAPI } from '../../api/axios';
import LoadingSpinner from '../../components/LoadingSpinner';
import { formatCurrency } from '../../utils/helpers';

const StatCard = ({ icon, label, value, color }) => (
  <div className="stat-card" style={{ borderColor: color }}>
    <div className="stat-icon" style={{ color }}>{icon}</div>
    <div className="stat-info">
      <p className="stat-label">{label}</p>
      <h2 className="stat-value">{value}</h2>
    </div>
  </div>
);

const AdminDashboard = () => {
  const [stats,    setStats]    = useState(null);
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [moviesRes, showsRes, bookingsRes] = await Promise.all([
          adminAPI.getAllMovies(),
          adminAPI.getAllShows(),
          adminAPI.getAllBookings(),
        ]);
        const confirmed = bookingsRes.data.filter(b => b.bookingStatus === 'CONFIRMED');
        const revenue   = confirmed.reduce((sum, b) => sum + Number(b.totalAmount), 0);

        setStats({
          movies:   moviesRes.data.length,
          shows:    showsRes.data.length,
          bookings: bookingsRes.data.length,
          revenue,
        });
        setBookings(bookingsRes.data.slice(0, 6));
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <LoadingSpinner message="Loading dashboard..." />;

  return (
    <div className="admin-page">
      <div className="admin-header">
        <h1>🛠️ Admin Dashboard</h1>
        <p>Manage your cinema operations</p>
      </div>

      <div className="container">
        {/* Stats */}
        <div className="stats-grid">
          <StatCard icon="🎬" label="Total Movies"   value={stats?.movies}   color="#e94560" />
          <StatCard icon="📽️" label="Total Shows"    value={stats?.shows}    color="#0984e3" />
          <StatCard icon="🎟️" label="Total Bookings" value={stats?.bookings} color="#6c5ce7" />
          <StatCard icon="💰" label="Total Revenue"
                    value={formatCurrency(stats?.revenue)} color="#00b894" />
        </div>

        {/* Quick Actions */}
        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            <Link to="/admin/movies" className="action-card">
              <i className="fas fa-plus-circle fa-2x"></i>
              <span>Add Movie</span>
            </Link>
            <Link to="/admin/shows" className="action-card">
              <i className="fas fa-calendar-plus fa-2x"></i>
              <span>Add Show</span>
            </Link>
            <Link to="/admin/movies" className="action-card">
              <i className="fas fa-edit fa-2x"></i>
              <span>Edit Movies</span>
            </Link>
            <Link to="/admin/shows" className="action-card">
              <i className="fas fa-cog fa-2x"></i>
              <span>Manage Shows</span>
            </Link>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="recent-bookings">
          <h2>Recent Bookings</h2>
          <div className="bookings-table-wrapper">
            <table className="bookings-table">
              <thead>
                <tr>
                  <th>Reference</th>
                  <th>Movie</th>
                  <th>User</th>
                  <th>Seats</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map(b => (
                  <tr key={b.id}>
                    <td><code>{b.bookingReference}</code></td>
                    <td>{b.movieTitle}</td>
                    <td>{b.username}</td>
                    <td>{b.bookedSeats?.join(', ')}</td>
                    <td>{formatCurrency(b.totalAmount)}</td>
                    <td>
                      <span className={`badge-status ${b.bookingStatus.toLowerCase()}`}>
                        {b.bookingStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style>{`
        .admin-page { min-height: calc(100vh - 70px); }
        .admin-header {
          background: linear-gradient(135deg, var(--surface), var(--surface-light));
          padding: 2.5rem; border-bottom: 1px solid var(--border);
        }
        .admin-header h1 { font-size: 2rem; margin-bottom: 0.3rem; }
        .admin-header p  { color: var(--text-secondary); }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1.5rem; margin-bottom: 2.5rem;
        }
        .stat-card {
          background: var(--surface);
          border: 1px solid; border-radius: 16px;
          padding: 1.5rem;
          display: flex; align-items: center; gap: 1rem;
          transition: var(--transition);
        }
        .stat-card:hover { transform: translateY(-4px); box-shadow: var(--shadow); }
        .stat-icon { font-size: 2.5rem; }
        .stat-label { color: var(--text-secondary); font-size: 0.85rem; margin-bottom: 4px; }
        .stat-value { font-size: 1.8rem; font-weight: 800; }
        .quick-actions { margin-bottom: 2.5rem; }
        .quick-actions h2 { font-size: 1.3rem; margin-bottom: 1rem; }
        .actions-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
          gap: 1rem;
        }
        .action-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px; padding: 1.5rem;
          display: flex; flex-direction: column;
          align-items: center; gap: 0.8rem;
          color: var(--text-primary);
          text-align: center;
          transition: var(--transition); cursor: pointer;
          font-size: 0.9rem; font-weight: 600;
        }
        .action-card i { color: var(--primary); }
        .action-card:hover {
          border-color: var(--primary);
          background: rgba(233,69,96,0.05);
          transform: translateY(-4px);
        }
        .recent-bookings h2 { font-size: 1.3rem; margin-bottom: 1rem; }
        .bookings-table-wrapper { overflow-x: auto; border-radius: 14px; }
        .bookings-table {
          width: 100%; border-collapse: collapse;
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 14px; overflow: hidden;
        }
        .bookings-table th, .bookings-table td {
          padding: 12px 16px; text-align: left;
          border-bottom: 1px solid var(--border);
          font-size: 0.9rem;
        }
        .bookings-table th {
          background: var(--surface-light);
          color: var(--text-secondary);
          font-weight: 600; font-size: 0.8rem;
          text-transform: uppercase; letter-spacing: 1px;
        }
        .bookings-table tr:last-child td { border-bottom: none; }
        .bookings-table tbody tr:hover { background: var(--surface-light); }
        .badge-status {
          padding: 3px 12px; border-radius: 12px; font-size: 0.78rem; font-weight: 600;
        }
        .badge-status.confirmed { background: rgba(0,184,148,0.2); color: var(--success); }
        .badge-status.cancelled { background: rgba(225,112,85,0.2); color: var(--danger); }
        .badge-status.pending   { background: rgba(253,203,110,0.2); color: var(--warning); }
      `}</style>
    </div>
  );
};

export default AdminDashboard;