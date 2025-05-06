import { useState, useRef, useEffect } from "react";
import { User } from "lucide-react";
import { useAuthStore } from "../store/authStore";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { staticImageBaseUrl } from "../constants/appConstants";
import UserMenuDropdown from "./UserMenuDropdown";

interface UserMenuProps {
  isSidebarOpen: boolean;
}

const UserMenu: React.FC<UserMenuProps> = ({ isSidebarOpen }) => {
  const { username, email, isLoggedIn, logout, profilePicture } = useAuthStore();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      toast.success("Successfully logged out!");
      navigate("/login");
    } catch {
      toast.error("Failed to log out. Please try again.");
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, []);

  const profileImageUrl = profilePicture ? `${staticImageBaseUrl}${profilePicture}` : null;

  return (
    <div className="relative" ref={menuRef}>
      {isLoggedIn ? (
        <>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center space-x-3 p-2 rounded-full transition-all duration-200 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
            data-testid="logout-box"
          >
            {profileImageUrl ? (
              <img
                src={profileImageUrl}
                alt="Profile"
                className="w-9 h-9 rounded-full object-cover border border-gray-300 dark:border-gray-600"
              />
            ) : (
              <div className="w-9 h-9 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700">
                <User className="w-5 h-5 text-gray-600 dark:text-gray-300" />
              </div>
            )}
            <span className="text-sm font-semibold text-gray-800 dark:text-gray-200">
              {username || "User"}
            </span>
          </button>

          {isOpen && (
            <UserMenuDropdown
              email={email}
              onLogout={handleLogout}
              position={isSidebarOpen === false ? "top" : "bottom"}
            />
          )}
        </>
      ) : (
        <p className="text-sm text-gray-600 dark:text-gray-400 italic">Not logged in</p>
      )}
    </div>
  );
};

export default UserMenu;
