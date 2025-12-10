import { Route, Routes } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { axiosClient } from "./utils/axiosClient";
import { useEffect } from "react";
import MainContextProvider from "./context/MainContext";
import ProtectedLayout from "./layout/ProtectedLayout";
import ProfilePage from "./pages/ProfilePage";

const checkServerHealth = async () => {
  try {
    const response = await axiosClient.get("/health");
    console.log(response.data);
  } catch (error) {
    console.error("Server health check failed:", error);
  }
};

function App() {
  useEffect(() => {
    checkServerHealth();
  }, []);

  return (
    <MainContextProvider>
      <Navbar />
      <Routes>

        {/* Protected Routes Wrapper */}
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>

        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
      <Footer />
    </MainContextProvider>
  );
}

export default App;
