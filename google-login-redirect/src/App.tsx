import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useAuthStore } from "./stores/useAuthStore";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Booking from "./pages/Booking";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const { user, verifySessionPeriodically } = useAuthStore();

  // 🔄 Verify session every 5s while logged in
  React.useEffect(() => {
    if (!user) return;

    const interval = setInterval(() => {
      verifySessionPeriodically();
    }, 5000);

    return () => clearInterval(interval);
  }, [user, verifySessionPeriodically]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route
          path="/booking"
          element={
            <ProtectedRoute>
              <Booking />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
