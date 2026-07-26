import { Navigate, Route, Routes } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import AppShell from "./components/AppShell";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import StudentProfile from "./pages/StudentProfile";
import Workspace from "./pages/Workspace";
import AdminPanel from "./pages/AdminPanel";
import Directory from "./pages/Directory";
import "./App.css";
import "./workspace.css";

function ProtectedRoute() {
  const { user, ready } = useAuth();

  if (!ready) return <div className="app-loader"><span /></div>;
  return user ? <AppShell /> : <Navigate to="/login" replace />;
}

function GuestRoute({ children }) {
  const { user, ready } = useAuth();
  if (!ready) return <div className="app-loader"><span /></div>;
  return user ? <Navigate to="/dashboard" replace /> : children;
}

export default function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<GuestRoute><Login /></GuestRoute>} />
        <Route path="/register" element={<GuestRoute><Register /></GuestRoute>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/opportunities" element={<Explore />} />
          <Route path="/work" element={<Workspace />} />
          <Route path="/directory" element={<Directory />} />
          <Route path="/profile" element={<StudentProfile />} />
          <Route path="/admin" element={<AdminPanel />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
