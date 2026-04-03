import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { bookingAPI } from '../api/axios';
import { formatCurrency, formatDate, formatTime } from '../utils/helpers';
import { toast } from 'react-toastify';

const PaymentPage = () => {
  const { state }  = useLocation();
  const navigate   = useNavigate();

  const { show, movie, selectedSeats, totalAmount } = state || {};

  const [loading,  setLoading]  = useState(false);
  const [cardForm, setCardForm] = useState({
    cardNumber: '', cardName: '', expiry: '', cvv: ''
  });
  const [method, setMethod] = useState('card');

  if (!show || !movie) {
    navigate('/');
    return null;
  }

  const handleCardChange = (e) => {
    let { name, value } = e.target;
    if (name === 'cardNumber')
      value = value.replace(/\D/g,'').slice(0,16).replace(/(.{4})/g,'$1 ').trim();
    if (name === 'expiry')
      value = value.replace(/\D/g,'').slice(0,4)
                   .replace(/(\d{2})(\d)/,'$1/$2');
    if (name === 'cvv')
      value = value.replace(/\D/g,'').slice(0,3);
    setCardForm({ ...cardForm, [name]: value });
  };

  const handleConfirmPayment = async () => {
    if (method === 'card') {
      if (!cardForm.cardNumber || cardForm.cardNumber.replace(/\s/g,'').length < 16) {
        toast.error('Enter a valid 16-digit card number'); return;
      }
      if (!cardForm.cardName) { toast.error('Enter cardholder name'); return; }
      if (!cardForm.expiry || cardForm.expiry.length < 5) {
        toast.error('Enter a valid expiry date'); return;
      }
      if (!cardForm.cvv || cardForm.cvv.length < 3) {
        toast.error('Enter a valid CVV'); return;
      }
    }

    setLoading(true);
    try {
      const { data } = await bookingAPI.create({
        showId:        show.id,
        selectedSeats: selectedSeats,
      });
      toast.success('🎉 Payment successful! Booking confirmed!');
      navigate('/booking/confirmation', { state: { booking: data } });
    } catch (err) {
      const msg = err.response?.data?.message || 'Booking failed. Try again.';
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-page">
      <div className="payment-container">

        {/* Order Summary */}
        <div className="payment-summary-card">
          <h2><i className="fas fa-receipt"></i> Order Summary</h2>
          <div className="summary-row">
            <span>Movie</span>
            <strong>{movie.title}</strong>
          </div>
          <div className="summary-row">
            <span>Date</span>
            <strong>{formatDate(show.showDate)}</strong>
          </div>
          <div className="summary-row">
            <span>Time</span>
            <strong>{formatTime(show.showTime)}</strong>
          </div>
          <div className="summary-row">
            <span>Hall</span>
            <strong>{show.hallName}</strong>
          </div>
          <div className="summary-row">
            <span>Seats</span>
            <strong>{selectedSeats?.join(', ')}</strong>
          </div>
          <div className="summary-row">
            <span>Tickets</span>
            <strong>{selectedSeats?.length} × {formatCurrency(show.ticketPrice)}</strong>
          </div>
          <div className="summary-divider" />
          <div className="summary-row total-row">
            <span>Total Amount</span>
            <strong className="total-amt">{formatCurrency(totalAmount)}</strong>
          </div>
        </div>

        {/* Payment Form */}
        <div className="payment-form-card">
          <h2><i className="fas fa-credit-card"></i> Payment</h2>

          {/* Method Selection */}
          <div className="payment-methods">
            {['card','upi','netbanking'].map(m => (
              <button
                key={m}
                className={`method-btn ${method === m ? 'active' : ''}`}
                onClick={() => setMethod(m)}
              >
                {m === 'card'       && <><i className="fas fa-credit-card"></i> Card</>}
                {m === 'upi'        && <><i className="fas fa-mobile-alt"></i> UPI</>}
                {m === 'netbanking' && <><i className="fas fa-university"></i> Net Banking</>}
              </button>
            ))}
          </div>

          {/* Card Form */}
          {method === 'card' && (
            <div className="card-form">
              <div className="form-group">
                <label>Card Number</label>
                <input
                  type="text"
                  name="cardNumber"
                  value={cardForm.cardNumber}
                  onChange={handleCardChange}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>
              <div className="form-group">
                <label>Cardholder Name</label>
                <input
                  type="text"
                  name="cardName"
                  value={cardForm.cardName}
                  onChange={handleCardChange}
                  placeholder="John Doe"
                />
              </div>
              <div className="card-form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input
                    type="text"
                    name="expiry"
                    value={cardForm.expiry}
                    onChange={handleCardChange}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input
                    type="password"
                    name="cvv"
                    value={cardForm.cvv}
                    onChange={handleCardChange}
                    placeholder="•••"
                    maxLength={3}
                  />
                </div>
              </div>
            </div>
          )}

          {/* UPI Form */}
          {method === 'upi' && (
            <div className="form-group" style={{marginTop:'1rem'}}>
              <label>UPI ID</label>
              <input type="text" placeholder="yourname@upi" />
              <p style={{color:'var(--text-secondary)',fontSize:'0.8rem',marginTop:'6px'}}>
                * This is a demo — no real payment will be processed.
              </p>
            </div>
          )}

          {/* Net Banking */}
          {method === 'netbanking' && (
            <div className="form-group" style={{marginTop:'1rem'}}>
              <label>Select Bank</label>
              <select>
                <option>State Bank of India</option>
                <option>HDFC Bank</option>
                <option>ICICI Bank</option>
                <option>Axis Bank</option>
              </select>
              <p style={{color:'var(--text-secondary)',fontSize:'0.8rem',marginTop:'6px'}}>
                * This is a demo — no real payment will be processed.
              </p>
            </div>
          )}

          <div className="demo-notice">
            <i className="fas fa-info-circle"></i>
            &nbsp; This is a <strong>demo payment page</strong>.
            No real transaction will occur.
          </div>

          <button
            className="btn-primary pay-btn"
            onClick={handleConfirmPayment}
            disabled={loading}
          >
            {loading
              ? <><i className="fas fa-spinner fa-spin"></i> Processing...</>
              : <><i className="fas fa-lock"></i> Pay {formatCurrency(totalAmount)}</>}
          </button>

          <button
            className="btn-secondary back-btn"
            onClick={() => navigate(-1)}
            disabled={loading}
          >
            ← Change Seats
          </button>
        </div>
      </div>

      <style>{`
        .payment-page { padding: 2rem; min-height: calc(100vh - 70px); }
        .payment-container {
          display: grid;
          grid-template-columns: 1fr 1.2fr;
          gap: 2rem;
          max-width: 900px;
          margin: 0 auto;
        }
        .payment-summary-card, .payment-form-card {
          background: var(--surface);
          border: 1px solid var(--border);
          border-radius: 20px;
          padding: 2rem;
        }
        .payment-summary-card h2,
        .payment-form-card h2 {
          font-size: 1.3rem;
          margin-bottom: 1.5rem;
          display: flex; align-items: center; gap: 8px;
          color: var(--primary);
        }
        .summary-row {
          display: flex; justify-content: space-between;
          align-items: flex-start;
          padding: 0.6rem 0;
          font-size: 0.95rem;
          border-bottom: 1px solid var(--border);
        }
        .summary-row span { color: var(--text-secondary); }
        .summary-divider { height: 2px; background: var(--border); margin: 0.5rem 0; }
        .total-row { padding-top: 1rem; }
        .total-amt { font-size: 1.3rem; color: var(--primary); }
        .payment-methods {
          display: flex; gap: 0.8rem; margin-bottom: 1.5rem; flex-wrap: wrap;
        }
        .method-btn {
          flex: 1; min-width: 90px;
          background: var(--surface-light);
          border: 1px solid var(--border);
          color: var(--text-secondary);
          padding: 10px; border-radius: 10px;
          cursor: pointer; transition: var(--transition);
          display: flex; align-items: center; justify-content: center; gap: 6px;
          font-size: 0.9rem;
        }
        .method-btn.active {
          border-color: var(--primary);
          color: var(--primary);
          background: rgba(233,69,96,0.1);
        }
        .card-form { display: flex; flex-direction: column; gap: 0; }
        .card-form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .demo-notice {
          background: rgba(253,203,110,0.1);
          border: 1px solid rgba(253,203,110,0.3);
          color: var(--warning);
          padding: 10px 14px;
          border-radius: 8px;
          font-size: 0.85rem;
          margin: 1rem 0;
        }
        .pay-btn { width: 100%; justify-content: center; margin-bottom: 0.8rem; }
        .back-btn { width: 100%; justify-content: center; }
        @media (max-width: 768px) {
          .payment-container { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  );
};

export default PaymentPage;