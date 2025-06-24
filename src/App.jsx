import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import { LanguageProvider } from "./contexts/LanguageContext";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import LoadingSpinner from "./components/LoadingSpinner";

// Pages
import Home from "./pages/Home";
import Services from "./pages/Services";
import BookingSystem from "./pages/BookingSystem";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";

// Dashboard
import Dashboard from "./pages/Dashboard";
import DashboardAppointments from "./pages/dashboard/Appointments";
// import DashboardServices from './pages/dashboard/Services';
// import DashboardCustomers from "./pages/dashboard/Customers";
// import DashboardBarbers from "./pages/dashboard/Barbers";
// import DashboardAnalytics from "./pages/dashboard/Analytics";

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user) return <Navigate to="/login" />;

  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return children;
};

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <Navbar />
      <main className="pt-16">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Routes */}
          <Route
            path="/booking"
            element={
              <ProtectedRoute>
                <BookingSystem />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />

          {/* Dashboard Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute requiredRole="admin">
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/appointments"
            element={
              <ProtectedRoute>
                <DashboardAppointments />
              </ProtectedRoute>
            }
          />
          {/* <Route
            path="/dashboard/services"
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardServices />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/customers"
            element={
              <ProtectedRoute>
                <DashboardCustomers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/barbers"
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardBarbers />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard/analytics"
            element={
              <ProtectedRoute requiredRole="admin">
                <DashboardAnalytics />
              </ProtectedRoute>
            }
          /> */}
        </Routes>
      </main>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: "#1e293b",
            color: "#fff",
            border: "1px solid #f59332",
          },
        }}
      />
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <LanguageProvider>
          <AppContent />
        </LanguageProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
