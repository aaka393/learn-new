import React from "react";
import { LogOut, LogIn } from "lucide-react";
import { useAuthStore } from "../stores/useAuthStore";
import { useNavigate } from "react-router-dom";

interface UserMenuProps {
  onLoginClick?: () => void;
}

const UserMenu: React.FC<UserMenuProps> = ({ onLoginClick }) => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
  };

  const handleLogin = () => {
    if (onLoginClick) {
      onLoginClick();
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="flex items-center space-x-4">
      {user ? (
        <>
          <div className="flex items-center space-x-3">
            {user.profilePicture && (
              <img
                src={user.profilePicture}
                alt={user.username}
                className="w-8 h-8 rounded-full"
              />
            )}
            <span className="font-semibold text-gray-700">
              Hello, {user.username}!
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 text-gray-600 hover:text-red-600 transition-colors rounded-lg hover:bg-red-50 cursor-pointer"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </>
      ) : (
        <button
          onClick={handleLogin}
          className="p-2 flex items-center space-x-2 text-gray-600 hover:text-blue-600 transition-colors rounded-lg hover:bg-blue-50 cursor-pointer"
          title="Login"
        >
          <LogIn className="w-5 h-5" />
          <span className="hidden sm:inline">Login</span>
        </button>
      )}

    </div>
  );
};

export default UserMenu;