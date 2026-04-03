// Format currency in INR
export const formatCurrency = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style:    'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
  }).format(amount);

// Format date to readable string
export const formatDate = (dateStr) => {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-IN', {
    weekday: 'short',
    year:    'numeric',
    month:   'short',
    day:     'numeric',
  });
};

// Format time to 12-hour format
export const formatTime = (timeStr) => {
  if (!timeStr) return '';
  const [h, m] = timeStr.split(':');
  const hour   = parseInt(h);
  const ampm   = hour >= 12 ? 'PM' : 'AM';
  const hour12 = hour % 12 || 12;
  return `${hour12}:${m} ${ampm}`;
};

// Generate seat grid from flat seat list
export const groupSeatsByRow = (seats) => {
  const rows = {};
  seats.forEach((seat) => {
    const row = seat.seatRow || seat.seatNumber.charAt(0);
    if (!rows[row]) rows[row] = [];
    rows[row].push(seat);
  });
  return rows;
};

// Get seat type color class
export const getSeatTypeClass = (seatType) => {
  switch (seatType) {
    case 'VIP':      return 'seat-vip';
    case 'PREMIUM':  return 'seat-premium';
    default:         return 'seat-standard';
  }
};

// Truncate long text
export const truncateText = (text, maxLen = 120) => {
  if (!text || text.length <= maxLen) return text;
  return text.substring(0, maxLen) + '...';
};

// Get booking status badge color
export const getStatusColor = (status) => {
  switch (status) {
    case 'CONFIRMED': return '#00b894';
    case 'CANCELLED': return '#e17055';
    case 'PENDING':   return '#fdcb6e';
    default:          return '#636e72';
  }
};