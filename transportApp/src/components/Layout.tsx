import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/authStore';
import { Truck, Home, Map, User, LogOut, Package, Menu, X } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { user, logout } = useAuthStore();
  const location = useLocation();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const navItems = [
    {
      path: '/',
      label: 'Home',
      icon: <Home size={20} />,
      roles: ['customer', 'driver', 'admin'],
    },
    {
      path: '/dashboard',
      label: 'Dashboard',
      icon: <Truck size={20} />,
      roles: ['driver'],
    },
    {
      path: '/bookings',
      label: 'My Bookings',
      icon: <Package size={20} />,
      roles: ['customer'],
    },
    {
      path: '/tracking',
      label: 'Live Tracking',
      icon: <Map size={20} />,
      roles: ['customer', 'driver'],
    },
    {
      path: '/profile',
      label: 'Profile',
      icon: <User size={20} />,
      roles: ['customer', 'driver', 'admin'],
    },
  ];

  // Filter nav items based on user role
  const filteredNavItems = user
    ? navItems.filter((item) => item.roles.includes(user.role))
    : navItems;

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile menu button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="fixed top-4 right-4 z-50 md:hidden bg-white p-2 rounded-full shadow-lg"
      >
        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        } transform transition-transform duration-300 ease-in-out md:translate-x-0 fixed md:static top-0 left-0 h-full w-64 bg-white shadow-lg z-40 md:z-auto`}
      >
        <div className="p-6">
          <div className="flex items-center mb-8">
            <Truck size={28} className="text-indigo-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-800">RideShare</h1>
          </div>

          <nav className="space-y-1">
            {filteredNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                  isActive(item.path)
                    ? 'bg-indigo-50 text-indigo-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <span className="mr-3">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            ))}

            {user && (
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-3 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <LogOut size={20} className="mr-3" />
                <span className="font-medium">Logout</span>
              </button>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
};

export default Layout;