import { Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function About() {
  return <h2>Yeh About Page Hai</h2>;
}

function App() {
  return (
    <Routes>
      {/* Default route -> redirect to login */}
      <Route path="/" element={<Navigate to="/login" replace />} />

      {/* Public route */}
      <Route path="/login" element={<Login />} />

      {/* Protected route -> only accessible if logged in */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      <Route path="/about" element={<About />} />

      {/* Catch-all: any unknown URL goes to login */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    
    </Routes>
  );
}

export default App;
