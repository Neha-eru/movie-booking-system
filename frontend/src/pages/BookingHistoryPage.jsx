import React, { useEffect, useState } from 'react';
import { bookingAPI } from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { formatCurrency, formatDate, formatTime, getStatusColor } from '../utils/helpers';
import { toast } from 'react-toastify';

const BookingHistoryPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [cancelling, setCancelling] = useState(null);

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await bookingAPI.getMyBookings();
      setBookings(data);
    } catch {
      toast.error('Failed to load bookings');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancelling(bookingId);
    try {
      await bookingAPI.cancel(bookingId);
      toast.success('Booking cancelled & refund initiated');
      fetchBookings();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cancellation failed');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return <LoadingSpinner message="Loading your bookings..." />;

  return (
    <div>
      <div className="page-header">
        <h1>🎟️ My Bookings</h1>
        <p>Your complete booking history</p>
      </div>

      <div className="container">
        {bookings.length === 0 ? (
          <div className="empty-state">
            <i className="fas fa-ticket-alt fa-4x"></i>
            <h3>No bookings yet</h3>
            <p>Book your first movie and it'll appear here!</p>
            <a href="/" className="btn-primary" style={{display:'inline-block',marginTop:'1rem'}}>
              Browse Movies
            </a>
          </div>
        ) : (
          <div className="bookings-list">
            {bookings.map(booking => (
              <div key={booking.id} className="booking-card">
                <div className="booking-card-header">
                  <div>
                    <h3>{booking.movieTitle}</h3>
                    <span className="booking-ref">#{booking.bookingReference}</span>
                  </div>
                  <span
                    className="status-badge"
                    style={{ background: getStatusColor(booking.bookingStatus) + '22',
                             color: getStatusColor(booking.bookingStatus),
                             border: `1px solid ${getStatusColor(booking.bookingStatus)}` }}
                  >
                    {booking.bookingStatus}
                  </span>
                </div>

                <div className="booking-card-body">
                  <div className="booking-detail">
                    <i className="fas fa-calendar"></i>
                    <span>{formatDate(booking.showDate)}</span>
                  </div>
                  <div className="booking-detail">
                    <i className="fas fa-clock"></i>
                    <span>{formatTime(booking.showTime)}</span>
                  </div>
                  <div className="booking-detail">
                    <i className="fas fa-map-marker-alt"></i>
                    <span>{booking.hallName}</span>
                  </div>
                  <div className="booking-detail">
                    <i className="fas fa-chair"></i>
                    <span>{booking.bookedSeats?.join(', ')}</span>
                  </div>
                  <div className="booking-detail">
                    <i className="fas fa-rupee-sign"></i>
                    <span>{formatCurrency(booking.totalAmount)}</span>
                  </div>
                  <div className="booking-detail">
                    <i className="fas fa-clock"></i>
                    <span>Booked on {formatDate(booking.bookedAt)}</span>
                  </div>
                </div>

                {booking.bookingStatus === 'CONFIRMED' && (
                  <div className="booking-card-footer">
                    <button
                      className="btn-cancel"
                      onClick={() => handleCancel(booking.id)}
                      disabled={cancelling === booking.id}
                    >
                      {cancelling === booking.id
                        ? <><i className="fas fa-spinner fa-spin"></i> Cancelling...</>
                        : <><i className="fas fa-times"></i> Cancel Booking</>}
                    </button>
                  </div>
                )}

                {booking.bookingStatus === 'CANCELLED' && (
                  <div className="cancelled-notice">
                    <i className="fas fa-info-circle"></i>
                    Booking cancelled — Refund: {booking.paymentStatus}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .empty-state {
          text-align: center; padding: 5rem 2rem;
          color: var(--text-secondary);
          display: flex; flex-direction: column;
          align-items: center; gap: 1rem;
        }
        .bookings-list {
          display: flex; flex-direction: column; gap: 1.5rem;
          padding: 2rem 0;
        }
        .booking-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 16px; overflow: hidden;
          transition: var(--transition);
        }
        .booking-card:hover { border-color: var(--primary); }
        .booking-card-header {
          display: flex; justify-content: space-between;
          align-items: flex-start;
          padding: 1.5rem 1.5rem 1rem;
          border-bottom: 1px solid var(--border);
        }
        .booking-card-header h3 {
          font-size: 1.2rem; margin-bottom: 4px;
        }
        .booking-ref { color: var(--text-secondary); font-size: 0.85rem; }
        .status-badge {
          padding: 4px 14px; border-radius: 20px;
          font-size: 0.8rem; font-weight: 600;
        }
        .booking-card-body {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 0.8rem; padding: 1.2rem 1.5rem;
        }
        .booking-detail {
          display: flex; align-items: center; gap: 8px;
          color: var(--text-secondary); font-size: 0.9rem;
        }
        .booking-detail i { color: var(--primary); width: 16px; }
        .booking-card-footer {
          padding: 1rem 1.5rem;
          border-top: 1px solid var(--border);
        }
        .btn-cancel {
          background: transparent;
          border: 1px solid var(--danger);
          color: var(--danger);
          padding: 8px 20px; border-radius: 20px;
          cursor: pointer; font-size: 0.9rem;
          transition: var(--transition);
          display: flex; align-items: center; gap: 6px;
        }
        .btn-cancel:hover { background: var(--danger); color: white; }
        .btn-cancel:disabled { opacity: 0.5; cursor: not-allowed; }
        .cancelled-notice {
          padding: 0.8rem 1.5rem;
          background: rgba(225,112,85,0.1);
          color: var(--danger); font-size: 0.85rem;
          border-top: 1px solid var(--border);
          display: flex; align-items: center; gap: 8px;
        }
      `}</style>
    </div>
  );
};

export default BookingHistoryPage;