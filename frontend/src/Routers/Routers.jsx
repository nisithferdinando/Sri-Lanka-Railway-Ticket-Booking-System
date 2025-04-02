import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Home from "../Pages/Home";
import HomeS from "../Pages/sinhala/HomeS";
import Login from "../Pages/Login";
import SignUp from "../Pages/SignUp";
import SeatBooking from "../Pages/SeatBooking";
import SeatBookingS from "../Pages/sinhala/SeatBookingS";
import PassengerForm from "../Pages/PassengerForm";
import ReviewBooking from "../Pages/ReviewBooking";
import BookingPayment from "../Pages/BookingPayment";
import PassengerFormS from "../Pages/sinhala/PassengerFormS";
import ReviewBookingS from "../Pages/sinhala/ReviewBookingS";
import BookingPaymentS from "../Pages/sinhala/BookingPaymentS";
import Account from "../Pages/Account";
import Ticket from "../Pages/Ticket";
import LandingPage from "../Pages/LandingPage";
import AdminLogin from "../Pages/admin/adminLogin";
import AdminDashboard from "../Pages/admin/AdminDashboard";

const isAuthenticated = () => {
  return !!localStorage.getItem("token");
};

const ProtectedRoute = ({ element }) => {
  return isAuthenticated() ? element : <Navigate to="/landing" />;
};

const IsAdminAuthenticated = () => {
  return !!localStorage.getItem("adminToken");
};

const AdminProtectedRoutes = ({ element }) => {
  return IsAdminAuthenticated() ? element : <Navigate to="/adminPortalLogin" />;
};

const Routers = () => {
  return (
    <div>
      <Router>
        <Routes>
          {/* Public Routes */}

          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/landing" element={<LandingPage />} />

          <Route path="/adminPortalLogin" element={<AdminLogin />} />

          <Route
            path="/adminDashboard"
            element={<AdminProtectedRoutes element={<AdminDashboard />} />}
          />

          {/* Protected Routes */}
          <Route path="/" element={<ProtectedRoute element={<Home />} />} />

          <Route
            path="/home-sin"
            element={<ProtectedRoute element={<HomeS />} />}
          />

          <Route
            path="/seat-booking/:trainId"
            element={<ProtectedRoute element={<SeatBooking />} />}
          />
          <Route
            path="/seat-bookingS/:trainId"
            element={<ProtectedRoute element={<SeatBookingS />} />}
          />
          <Route
            path="/contact-form"
            element={<ProtectedRoute element={<PassengerForm />} />}
          />
          <Route
            path="/review-booking"
            element={<ProtectedRoute element={<ReviewBooking />} />}
          />
          <Route
            path="/payment"
            element={<ProtectedRoute element={<BookingPayment />} />}
          />
          <Route
            path="/contact-formS"
            element={<ProtectedRoute element={<PassengerFormS />} />}
          />
          <Route
            path="/review-bookingS"
            element={<ProtectedRoute element={<ReviewBookingS />} />}
          />
          <Route
            path="/paymentS"
            element={<ProtectedRoute element={<BookingPaymentS />} />}
          />
          <Route
            path="/account/:userName"
            element={<ProtectedRoute element={<Account />} />}
          />
          <Route
            path="/tickets"
            element={<ProtectedRoute element={<Ticket />} />}
          />
        </Routes>
      </Router>
    </div>
  );
};

export default Routers;
