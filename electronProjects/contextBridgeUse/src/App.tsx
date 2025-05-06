
import './App.css'
import { BrowserRouter as Router, Routes, Route, } from 'react-router-dom';
import Register from './pages/Register';
import { Login } from './pages/Login';
import { useEffect } from 'react';
import { useAuthStore } from './store/authStore';
import { ThemeProvider } from './contexts/ThemeContext';
import { RegistryProvider } from './contexts/RegistryContext';
import Welcome from './pages/Welcome';
function App() {
  const { user, verifyToken } = useAuthStore();
  useEffect(() => {
    if (user) {
      verifyToken();
      const intervalId = setInterval(() => {
        verifyToken();
      }, 5000);
      return () => clearInterval(intervalId);
    }
  }, [user, verifyToken]);
  return (
    <>
      <RegistryProvider>
        <ThemeProvider>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<Welcome />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </Router>
        </ThemeProvider>
      </RegistryProvider>
    </>
  )
}

export default App
