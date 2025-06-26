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
import DashboardLayout from "./components/DashboardLayout";

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
import DashboardServices from "./pages/dashboard/Services";
import DashboardCustomers from "./pages/dashboard/Customers";
import DashboardBarbers from "./pages/dashboard/Barbers";
import DashboardAnalytics from "./pages/dashboard/Analytics";
import TimeManagement from "./pages/dashboard/TimeManagement";

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

// Dashboard Route Component
const DashboardRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  if (!user) return <Navigate to="/login" />;

  if (requiredRole && user.role !== requiredRole && user.role !== "admin") {
    return <Navigate to="/" />;
  }

  return <DashboardLayout>{children}</DashboardLayout>;
};

const AppContent = () => {
  const { loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br from-dark-900 via-dark-800 to-dark-900">
      <Routes>
        {/* Public Routes with Navbar */}
        <Route path="/" element={
          <>
            <Navbar />
            <main className="pt-16">
              <Home />
            </main>
            <Footer />
          </>
        } />
        <Route path="/services" element={
          <>
            <Navbar />
            <main className="pt-16">
              <Services />
            </main>
            <Footer />
          </>
        } />
        <Route path="/login" element={
          <>
            <Navbar />
            <main className="pt-16">
              <Login />
            </main>
            <Footer />
          </>
        } />
        <Route path="/register" element={
          <>
            <Navbar />
            <main className="pt-16">
              <Register />
            </main>
            <Footer />
          </>
        } />

        {/* Protected Routes with Navbar */}
        <Route path="/booking" element={
          <ProtectedRoute>
            <Navbar />
            <main className="pt-16">
              <BookingSystem />
            </main>
            <Footer />
          </ProtectedRoute>
        } />
        <Route path="/profile" element={
          <ProtectedRoute>
            <Navbar />
            <main className="pt-16">
              <Profile />
            </main>
            <Footer />
          </ProtectedRoute>
        } />

        {/* Dashboard Routes with Sidebar Layout */}
        <Route path="/dashboard" element={
          <DashboardRoute requiredRole="admin">
            <Dashboard />
          </DashboardRoute>
        } />
        <Route path="/dashboard/appointments" element={
          <DashboardRoute>
            <DashboardAppointments />
          </DashboardRoute>
        } />
        <Route path="/dashboard/services" element={
          <DashboardRoute requiredRole="admin">
            <DashboardServices />
          </DashboardRoute>
        } />
        <Route path="/dashboard/customers" element={
          <DashboardRoute>
            <DashboardCustomers />
          </DashboardRoute>
        } />
        <Route path="/dashboard/barbers" element={
          <DashboardRoute requiredRole="admin">
            <DashboardBarbers />
          </DashboardRoute>
        } />
        <Route path="/dashboard/analytics" element={
          <DashboardRoute requiredRole="admin">
            <DashboardAnalytics />
          </DashboardRoute>
        } />
        <Route path="/dashboard/time-management" element={
          <DashboardRoute requiredRole="admin">
            <TimeManagement />
          </DashboardRoute>
        } />
      </Routes>

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