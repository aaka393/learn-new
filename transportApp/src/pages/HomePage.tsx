import React, { useState } from 'react';
import Map from '../components/Map';
import BookingForm from '../components/BookingForm';
import { useBookingStore } from '../store/bookingStore';
import { useAuthStore } from '../store/authStore';
import { Location } from '../types';
import { Truck, MapPin, Navigation, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HomePage: React.FC = () => {
  const { user } = useAuthStore();
  const { setPickupLocation, setDropoffLocation, createBooking } = useBookingStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const navigate = useNavigate();

  const handlePickupSelect = (location: Location) => {
    setPickupLocation(location);
  };

  const handleDropoffSelect = (location: Location) => {
    setDropoffLocation(location);
  };

  const handleBookingSubmit = async () => {
    try {
      const booking = await createBooking();
      // Navigate to booking details page
      navigate(`/bookings/${booking.id}`);
    } catch (error) {
      console.error('Booking failed:', error);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        className="fixed top-4 right-4 z-50 md:hidden bg-white p-2 rounded-full shadow-lg"
      >
        {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } transform transition-transform duration-300 ease-in-out md:translate-x-0 fixed md:static top-0 left-0 h-full w-full md:w-96 bg-white z-40 md:z-auto shadow-lg md:shadow-none overflow-y-auto`}
      >
        <div className="p-6">
          <div className="flex items-center mb-8">
            <Truck size={32} className="text-indigo-600 mr-3" />
            <h1 className="text-2xl font-bold text-gray-800">RideShare</h1>
          </div>

          <BookingForm onSubmit={handleBookingSubmit} />
        </div>
      </div>

      {/* Map Container */}
      <div className="flex-1 relative">
        <Map
          isSelectable={true}
          onPickupSelect={handlePickupSelect}
          onDropoffSelect={handleDropoffSelect}
        />

        {/* Location Legend */}
        <div className="absolute bottom-4 left-4 bg-white p-3 rounded-lg shadow-md z-10">
          <div className="flex flex-col gap-2">
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-blue-500 mr-2"></div>
              <span className="text-sm">Your Location</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
              <span className="text-sm">Pickup Point</span>
            </div>
            <div className="flex items-center">
              <div className="w-4 h-4 rounded-full bg-red-500 mr-2"></div>
              <span className="text-sm">Dropoff Point</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;