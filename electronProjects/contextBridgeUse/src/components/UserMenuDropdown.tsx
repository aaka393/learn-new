import { LogOut } from "lucide-react";

interface UserMenuDropdownProps {
  email: string | null;
  onLogout: () => void;
  position: "top" | "bottom";
}

const UserMenuDropdown: React.FC<UserMenuDropdownProps> = ({ email, onLogout, position }) => {
  return (
    <div
      className={`absolute w-64 right-0 rounded-xl shadow-xl bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-10 z-50 transition-all duration-300
        ${position === "top" ? "bottom-full mb-3" : "top-full mt-3"}`}
    >
      <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-700">
        <p className="text-sm font-medium text-gray-800 dark:text-gray-200">{email || "No email available"}</p>
      </div>

      <button
        onClick={onLogout}
        className="w-full flex items-center space-x-3 px-5 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
        data-testid="test-logout"
      >
        <LogOut className="w-5 h-5" />
        <span>Sign out</span>
      </button>
    </div>
  );
};

export default UserMenuDropdown;
