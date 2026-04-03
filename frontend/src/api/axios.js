import axios from 'axios';

const API = axios.create({
  baseURL: "https://movie-booking-system-ja3o.onrender.com/api",
  headers: { 'Content-Type': 'application/json' },
  timeout: 15000,
});



// ── Request interceptor — attach JWT ───────────────────────────
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Response interceptor — handle 401 ─────────────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Only redirect if not already on login page
      if (!window.location.pathname.includes('/login')) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// ── Helper to extract error message from response ──────────────
export const getErrorMessage = (error) => {
  if (error.response?.data?.message) return error.response.data.message;
  if (error.response?.data && typeof error.response.data === 'object') {
    const msgs = Object.values(error.response.data).filter(Boolean);
    if (msgs.length) return msgs.join(', ');
  }
  if (error.message === 'Network Error') return 'Cannot connect to server. Is the backend running?';
  return error.message || 'An unexpected error occurred';
};

// ── Auth APIs ──────────────────────────────────────────────────
export const authAPI = {
  login:    (data) => API.post('/auth/login',    data),
  register: (data) => API.post('/auth/register', data),
};

// ── Movie APIs ─────────────────────────────────────────────────
export const movieAPI = {
  getAll:  ()        => API.get('/movies'),
  getById: (id)      => API.get(`/movies/${id}`),
  search:  (keyword) => API.get(`/movies/search`, { params: { keyword } }),
};

// ── Show APIs ──────────────────────────────────────────────────
export const showAPI = {
  getAll:     ()        => API.get('/shows'),
  getById:    (id)      => API.get(`/shows/${id}`),
  getByMovie: (movieId) => API.get(`/shows/movie/${movieId}`),
};

// ── Seat APIs ──────────────────────────────────────────────────
export const seatAPI = {
  getByShow:    (showId) => API.get(`/seats/show/${showId}`),
  getAvailable: (showId) => API.get(`/seats/show/${showId}/available`),
};

// ── Booking APIs ───────────────────────────────────────────────
export const bookingAPI = {
  create:        (data) => API.post('/bookings',                data),
  getMyBookings: ()     => API.get('/bookings/my'),
  getById:       (id)   => API.get(`/bookings/${id}`),
  getByRef:      (ref)  => API.get(`/bookings/reference/${ref}`),
  cancel:        (id)   => API.put(`/bookings/${id}/cancel`),
};

// ── Admin APIs ─────────────────────────────────────────────────
export const adminAPI = {
  // Movies
  getAllMovies:  ()         => API.get('/admin/movies'),
  addMovie:     (data)     => API.post('/admin/movies',      data),
  updateMovie:  (id, data) => API.put(`/admin/movies/${id}`, data),
  deleteMovie:  (id)       => API.delete(`/admin/movies/${id}`),

  // Shows
  getAllShows:  ()         => API.get('/admin/shows'),
  addShow:     (data)     => API.post('/admin/shows',       data),
  updateShow:  (id, data) => API.put(`/admin/shows/${id}`,  data),
  deleteShow:  (id)       => API.delete(`/admin/shows/${id}`),

  // Bookings
  getAllBookings: () => API.get('/admin/bookings'),
};

export default API;