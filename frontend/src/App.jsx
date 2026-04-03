import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage               from './pages/HomePage';
import LoginPage              from './pages/LoginPage';
import RegisterPage           from './pages/RegisterPage';
import MovieDetailPage        from './pages/MovieDetailPage';
import SeatSelectionPage      from './pages/SeatSelectionPage';
import PaymentPage            from './pages/PaymentPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import BookingHistoryPage     from './pages/BookingHistoryPage';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminMovies    from './pages/admin/AdminMovies';
import AdminShows     from './pages/admin/AdminShows';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-wrapper">
          <Navbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/"               element={<HomePage />} />
              <Route path="/login"          element={<LoginPage />} />
              <Route path="/register"       element={<RegisterPage />} />
              <Route path="/movies/:id"     element={<MovieDetailPage />} />

              {/* Protected User Routes */}
              <Route element={<ProtectedRoute />}>
                <Route path="/shows/:showId/seats"
                       element={<SeatSelectionPage />} />
                <Route path="/payment"
                       element={<PaymentPage />} />
                <Route path="/booking/confirmation"
                       element={<BookingConfirmationPage />} />
                <Route path="/bookings/history"
                       element={<BookingHistoryPage />} />
              </Route>

              {/* Protected Admin Routes */}
              <Route element={<ProtectedRoute adminOnly />}>
                <Route path="/admin"          element={<AdminDashboard />} />
                <Route path="/admin/movies"   element={<AdminMovies />} />
                <Route path="/admin/shows"    element={<AdminShows />} />
              </Route>

              {/* Fallback */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop
          closeOnClick
          pauseOnHover
          theme="dark"
        />
      </Router>
    </AuthProvider>
  );
}

export default App;