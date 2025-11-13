import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../stores/useAuthStore";
import UserMenu from "../components/UserMenu";

const Home: React.FC = () => {
  const navigate = useNavigate();
  const { verifyTokenAfterLogin, user } = useAuthStore();

  useEffect(() => {
    // Check for authentication after login redirect
    console.log('Home page mounted, checking auth...');
    verifyTokenAfterLogin();
  }, [verifyTokenAfterLogin]);

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                My App
              </h1>
            </div>
            <UserMenu onLoginClick={handleLoginClick} />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Welcome to My App
          </h2>
          <p className="text-lg text-gray-600 mb-8">
            {user ? (
              <>
                You are successfully logged in and can access all features.
                <br />
                <span className="text-base">Navigate to any page using the menu above.</span>
              </>
            ) : (
              "Please log in to access all features."
            )}
          </p>


          {user && (
            <div className="space-y-4">
              <button
                onClick={() => navigate('/booking')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Go to Booking (Protected)
              </button>
            </div>
          )}

          {!user && (
            <div className="space-y-4">
              <button
                onClick={handleLoginClick}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors cursor-pointer"
              >
                Login to Continue
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Home;