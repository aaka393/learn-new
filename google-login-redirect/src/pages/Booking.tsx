import React, { useEffect } from "react";
import { Calendar, Clock, MapPin } from "lucide-react";
import UserMenu from "../components/UserMenu";
import { useAuthStore } from "../stores/useAuthStore";
import { Link } from "react-router-dom";

const Booking: React.FC = () => {
  const { user } = useAuthStore();


 
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                <Link to="/">Home</Link>
              </h1>
            </div>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white rounded-lg shadow-sm border p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Booking Page (Protected)
            </h2>
            <p className="text-gray-600">
              Welcome {user?.username}! This is a protected page that requires authentication.
            </p>

          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <Calendar className="w-6 h-6 text-blue-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Schedule</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Manage your upcoming appointments and bookings.
              </p>
            </div>

            <div className="bg-purple-50 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <Clock className="w-6 h-6 text-purple-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Time Slots</h3>
              </div>
              <p className="text-gray-600 text-sm">
                View available time slots and make new reservations.
              </p>
            </div>

            <div className="bg-orange-50 p-6 rounded-lg">
              <div className="flex items-center mb-3">
                <MapPin className="w-6 h-6 text-orange-600 mr-2" />
                <h3 className="font-semibold text-gray-900">Locations</h3>
              </div>
              <p className="text-gray-600 text-sm">
                Browse and select from available booking locations.
              </p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 text-sm">
              🔒 <strong>Protected Content:</strong> You can only see this page because you're authenticated.
              If you weren't logged in, you would have been redirected to the login page.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Booking;