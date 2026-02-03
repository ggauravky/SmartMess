import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import TodayMenu from "./pages/TodayMenu";
import WeeklyMenu from "./pages/WeeklyMenu";
import RateMeal from "./pages/RateMeal";
import MyRatings from "./pages/MyRatings";
import Profile from "./pages/Profile";
import NotFound from "./pages/NotFound";

// Admin Pages
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManageMenu from "./pages/admin/ManageMenu";
import ViewRatings from "./pages/admin/ViewRatings";
import ManageStudents from "./pages/admin/ManageStudents";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#363636",
              color: "#fff",
            },
          }}
        />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Protected Student Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/today-menu"
            element={
              <ProtectedRoute>
                <TodayMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/weekly-menu"
            element={
              <ProtectedRoute>
                <WeeklyMenu />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rate-meal/:menuId/:mealType"
            element={
              <ProtectedRoute>
                <RateMeal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-ratings"
            element={
              <ProtectedRoute>
                <MyRatings />
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

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/manage-menu"
            element={
              <AdminRoute>
                <ManageMenu />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/ratings"
            element={
              <AdminRoute>
                <ViewRatings />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/students"
            element={
              <AdminRoute>
                <ManageStudents />
              </AdminRoute>
            }
          />

          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
