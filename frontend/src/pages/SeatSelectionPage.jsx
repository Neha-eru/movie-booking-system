import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { seatAPI } from '../api/axios';
import LoadingSpinner from '../components/LoadingSpinner';
import { groupSeatsByRow, getSeatTypeClass, formatCurrency } from '../utils/helpers';
import { toast } from 'react-toastify';

const SeatSelectionPage = () => {
  const { showId } = useParams();
  const { state }  = useLocation();
  const navigate   = useNavigate();

  const [seats,    setSeats]    = useState([]);
  const [selected, setSelected] = useState([]);
  const [loading,  setLoading]  = useState(true);

  const show  = state?.show;
  const movie = state?.movie;

  useEffect(() => {
    if (!show || !movie) { navigate('/'); return; }
    fetchSeats();
  }, [showId]);

  const fetchSeats = async () => {
    try {
      const { data } = await seatAPI.getByShow(showId);
      setSeats(data);
    } catch {
      toast.error('Failed to load seats');
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seat) => {
    if (seat.isBooked) return;
    setSelected(prev =>
      prev.includes(seat.seatNumber)
        ? prev.filter(s => s !== seat.seatNumber)
        : [...prev, seat.seatNumber]
    );
  };

  const totalAmount = selected.length * Number(show?.ticketPrice || 0);
  const seatRows    = groupSeatsByRow(seats);

  const handleProceed = () => {
    if (selected.length === 0) {
      toast.warning('Please select at least one seat');
      return;
    }
    navigate('/payment', {
      state: { show, movie, selectedSeats: selected, totalAmount }
    });
  };

  if (loading) return <LoadingSpinner message="Loading seats..." />;

  return (
    <div className="seat-page">
      <div className="seat-header">
        <h2>{movie?.title}</h2>
        <p>
          {show?.showDate} &nbsp;•&nbsp; {show?.showTime}
          &nbsp;•&nbsp; {show?.hallName}
        </p>
      </div>

      {/* Screen */}
      <div className="screen-section">
        <div className="screen">SCREEN</div>
        <div className="screen-curve" />
      </div>

      {/* Seat Legend */}
      <div className="seat-legend">
        <div className="legend-item">
          <div className="seat-demo seat-vip"></div> VIP
        </div>
        <div className="legend-item">
          <div className="seat-demo seat-premium"></div> Premium
        </div>
        <div className="legend-item">
          <div className="seat-demo seat-standard"></div> Standard
        </div>
        <div className="legend-item">
          <div className="seat-demo seat-booked"></div> Booked
        </div>
        <div className="legend-item">
          <div className="seat-demo seat-selected"></div> Selected
        </div>
      </div>

      {/* Seat Grid */}
      <div className="seat-grid-container">
        {Object.entries(seatRows).map(([row, rowSeats]) => (
          <div key={row} className="seat-row">
            <span className="row-label">{row}</span>
            <div className="seats-in-row">
              {rowSeats.map(seat => (
                <button
                  key={seat.id}
                  className={`seat
                    ${getSeatTypeClass(seat.seatType)}
                    ${seat.isBooked ? 'seat-booked' : ''}
                    ${selected.includes(seat.seatNumber) ? 'seat-selected' : ''}
                  `}
                  onClick={() => toggleSeat(seat)}
                  disabled={seat.isBooked}
                  title={`${seat.seatNumber} (${seat.seatType})`}
                >
                  {seat.seatNumber.replace(row, '')}
                </button>
              ))}
            </div>
            <span className="row-label">{row}</span>
          </div>
        ))}
      </div>

      {/* Booking Summary */}
      <div className="seat-summary">
        <div className="summary-info">
          {selected.length > 0 ? (
            <>
              <p>
                <strong>Selected:</strong>{' '}
                {selected.join(', ')}
              </p>
              <p>
                <strong>{selected.length} seat(s)</strong>
                &nbsp;×&nbsp;
                {formatCurrency(show?.ticketPrice)}
                &nbsp;=&nbsp;
                <span className="total-price">{formatCurrency(totalAmount)}</span>
              </p>
            </>
          ) : (
            <p className="hint">👆 Click on seats above to select them</p>
          )}
        </div>
        <button
          className="btn-primary"
          onClick={handleProceed}
          disabled={selected.length === 0}
        >
          Proceed to Payment →
        </button>
      </div>

      <style>{`
        .seat-page { padding-bottom: 120px; }
        .seat-header {
          text-align: center; padding: 2rem;
          background: var(--surface);
          border-bottom: 1px solid var(--border);
        }
        .seat-header h2 { font-size: 1.6rem; margin-bottom: 0.3rem; }
        .seat-header p  { color: var(--text-secondary); }
        .screen-section { text-align: center; padding: 2rem 1rem 0; }
        .screen {
          display: inline-block;
          background: linear-gradient(to bottom, #fff, #e0e0e0);
          color: #333; padding: 8px 60px; font-weight: 700;
          border-radius: 4px 4px 0 0; font-size: 0.85rem;
          letter-spacing: 4px;
        }
        .screen-curve {
          height: 20px;
          background: linear-gradient(to bottom, rgba(255,255,255,0.1), transparent);
          border-radius: 50%;
          width: 70%;
          margin: 0 auto;
        }
        .seat-legend {
          display: flex; gap: 1.5rem; justify-content: center;
          flex-wrap: wrap; padding: 1.5rem;
        }
        .legend-item { display: flex; align-items: center; gap: 6px;
                       font-size: 0.85rem; color: var(--text-secondary); }
        .seat-demo {
          width: 24px; height: 24px; border-radius: 6px 6px 4px 4px;
        }
        .seat-grid-container { padding: 1rem 2rem; overflow-x: auto; }
        .seat-row {
          display: flex; align-items: center;
          gap: 0.5rem; margin-bottom: 0.5rem;
          justify-content: center;
        }
        .row-label {
          width: 24px; text-align: center;
          color: var(--text-secondary); font-size: 0.8rem; font-weight: 700;
        }
        .seats-in-row { display: flex; gap: 6px; flex-wrap: wrap; justify-content: center; }
        .seat {
          width: 34px; height: 34px;
          border-radius: 6px 6px 4px 4px;
          border: none; cursor: pointer;
          font-size: 0.7rem; font-weight: 600;
          transition: var(--transition);
          color: white;
        }
        .seat:hover:not(:disabled):not(.seat-booked) { transform: scale(1.15); }
        .seat-vip      { background: #6c5ce7; }
        .seat-premium  { background: #0984e3; }
        .seat-standard { background: #00b894; }
        .seat-booked   {
          background: #636e72 !important;
          cursor: not-allowed; opacity: 0.5;
        }
        .seat-selected {
          background: var(--primary) !important;
          box-shadow: 0 0 10px rgba(233,69,96,0.6);
          transform: scale(1.1);
        }
        .seat-summary {
          position: fixed; bottom: 0; left: 0; right: 0;
          background: var(--surface);
          border-top: 2px solid var(--primary);
          padding: 1rem 2rem;
          display: flex;
          align-items: center; justify-content: space-between;
          gap: 1rem; z-index: 100;
          flex-wrap: wrap;
        }
        .summary-info p { margin-bottom: 4px; font-size: 0.95rem; }
        .total-price { color: var(--primary); font-weight: 700; font-size: 1.1rem; }
        .hint { color: var(--text-secondary); }
      `}</style>
    </div>
  );
};

export default SeatSelectionPage;