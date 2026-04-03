import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { formatCurrency, formatDate, formatTime } from '../utils/helpers';

const BookingConfirmationPage = () => {
  const { state }  = useLocation();
  const navigate   = useNavigate();
  const booking    = state?.booking;

  if (!booking) { navigate('/'); return null; }

  return (
    <div className="confirm-page">
      <div className="confirm-card">
        <div className="confirm-icon">✅</div>
        <h1>Booking Confirmed!</h1>
        <p className="confirm-subtitle">
          Your tickets have been booked successfully. Enjoy the movie!
        </p>

        <div className="confirm-ref">
          <span>Booking Reference</span>
          <strong>{booking.bookingReference}</strong>
        </div>

        <div className="ticket-details">
          <div className="ticket-row">
            <i className="fas fa-film"></i>
            <div>
              <span>Movie</span>
              <strong>{booking.movieTitle}</strong>
            </div>
          </div>
          <div className="ticket-row">
            <i className="fas fa-calendar"></i>
            <div>
              <span>Date</span>
              <strong>{formatDate(booking.showDate)}</strong>
            </div>
          </div>
          <div className="ticket-row">
            <i className="fas fa-clock"></i>
            <div>
              <span>Time</span>
              <strong>{formatTime(booking.showTime)}</strong>
            </div>
          </div>
          <div className="ticket-row">
            <i className="fas fa-map-marker-alt"></i>
            <div>
              <span>Hall</span>
              <strong>{booking.hallName}</strong>
            </div>
          </div>
          <div className="ticket-row">
            <i className="fas fa-chair"></i>
            <div>
              <span>Seats</span>
              <strong>{booking.bookedSeats?.join(', ')}</strong>
            </div>
          </div>
          <div className="ticket-row">
            <i className="fas fa-rupee-sign"></i>
            <div>
              <span>Amount Paid</span>
              <strong className="paid-amt">
                {formatCurrency(booking.totalAmount)}
              </strong>
            </div>
          </div>
          <div className="ticket-row">
            <i className="fas fa-check-circle" style={{color:'var(--success)'}}></i>
            <div>
              <span>Status</span>
              <strong style={{color:'var(--success)'}}>
                {booking.bookingStatus}
              </strong>
            </div>
          </div>
        </div>

        <div className="confirm-actions">
          <button className="btn-primary"
                  onClick={() => navigate('/bookings/history')}>
            <i className="fas fa-ticket-alt"></i> My Bookings
          </button>
          <button className="btn-secondary"
                  onClick={() => navigate('/')}>
            <i className="fas fa-film"></i> Browse More Movies
          </button>
        </div>
      </div>

      <style>{`
        .confirm-page {
          min-height: calc(100vh - 70px);
          display: flex; align-items: center; justify-content: center;
          padding: 2rem;
          background: radial-gradient(ellipse at center, #16213e 0%, #1a1a2e 70%);
        }
        .confirm-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 24px;
          padding: 3rem 2.5rem;
          max-width: 520px; width: 100%;
          text-align: center;
          box-shadow: 0 30px 80px rgba(0,0,0,0.5);
        }
        .confirm-icon { font-size: 4rem; margin-bottom: 1rem; }
        .confirm-card h1 {
          font-size: 2rem; color: var(--success); margin-bottom: 0.5rem;
        }
        .confirm-subtitle {
          color: var(--text-secondary); margin-bottom: 2rem;
        }
        .confirm-ref {
          background: rgba(233,69,96,0.1);
          border: 1px dashed var(--primary);
          border-radius: 12px;
          padding: 1rem; margin-bottom: 2rem;
          display: flex; flex-direction: column; gap: 4px;
        }
        .confirm-ref span { color: var(--text-secondary); font-size: 0.85rem; }
        .confirm-ref strong {
          font-size: 1.3rem; color: var(--primary);
          letter-spacing: 2px;
        }
        .ticket-details {
          background: var(--surface-light);
          border-radius: 16px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          text-align: left;
          display: flex; flex-direction: column; gap: 1rem;
        }
        .ticket-row {
          display: flex; align-items: flex-start; gap: 1rem;
        }
        .ticket-row i { color: var(--primary); width: 18px; margin-top: 2px; }
        .ticket-row div { display: flex; flex-direction: column; gap: 2px; }
        .ticket-row span { color: var(--text-secondary); font-size: 0.8rem; }
        .ticket-row strong { font-size: 0.95rem; }
        .paid-amt { color: var(--success); font-size: 1.1rem !important; }
        .confirm-actions {
          display: flex; flex-direction: column; gap: 0.8rem;
        }
        .confirm-actions button { justify-content: center; }
      `}</style>
    </div>
  );
};

export default BookingConfirmationPage;