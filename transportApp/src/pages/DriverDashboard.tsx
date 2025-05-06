import React, { useEffect, useState } from 'react';
import { useBookingStore } from '../store/bookingStore';
import { useAuthStore } from '../store/authStore';
import { useSocket } from '../hooks/useSocket';
import Map from '../components/Map';
import { Booking } from '../types';
import { Clock, CheckCircle, XCircle, Navigation, Package, Truck } from 'lucide-react';

const DriverDashboard: React.FC = () => {
  const { user } = useAuthStore();
  const { currentBookings, fetchBookings, acceptBooking } = useBookingStore();
  const { isConnected, sendLocation } = useSocket();
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    fetchBookings();
    
    // Simulate sending location updates
    const intervalId = setInterval(() => {
      if (user?.location) {
        // Add a small random movement to simulate driving
        const lat = user.location.lat + (Math.random() - 0.5) * 0.001;
        const lng = user.location.lng + (Math.random() - 0.5) * 0.001;
        sendLocation(lat, lng);
      }
    }, 5000);
    
    return () => clearInterval(intervalId);
  }, [fetchBookings, user, sendLocation]);

  const handleAcceptBooking = async (bookingId: string) => {
    try {
      setIsLoading(true);
      await acceptBooking(bookingId);
      // Find the accepted booking and set it as selected
      const booking = currentBookings.find(b => b.id === bookingId);
      if (booking) {
        setSelectedBooking(booking);
      }
    } catch (error) {
      console.error('Failed to accept booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const pendingBookings = currentBookings.filter(b => b.status === 'pending');
  const activeBookings = currentBookings.filter(b => ['accepted', 'in-progress'].includes(b.status));

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-96 bg-white p-6 overflow-y-auto">
        <div className="flex items-center mb-6">
          <Truck size={28} className="text-indigo-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">Driver Dashboard</h1>
        </div>
        
        {/* Connection Status */}
        <div className={`mb-4 p-2 rounded-md ${isConnected ? 'bg-green-50' : 'bg-red-50'}`}>
          <p className={`text-sm flex items-center ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {isConnected ? 'Connected to server' : 'Disconnected from server'}
          </p>
        </div>
        
        {/* Active Bookings */}
        {activeBookings.length > 0 && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Active Bookings</h2>
            <div className="space-y-3">
              {activeBookings.map(booking => (
                <div 
                  key={booking.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedBooking?.id === booking.id 
                      ? 'border-indigo-500 bg-indigo-50' 
                      : 'border-gray-200 hover:border-indigo-300'
                  }`}
                  onClick={() => setSelectedBooking(booking)}
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 mb-2">
                        {booking.status}
                      </span>
                      <h3 className="font-medium">{booking.loadType}</h3>
                      <p className="text-sm text-gray-500">{booking.weight}kg • {booking.vehicleType}</p>
                    </div>
                    <p className="text-lg font-bold">₹{booking.fare}</p>
                  </div>
                  
                  <div className="mt-3 text-sm">
                    <div className="flex items-start mb-1">
                      <MapPin size={14} className="text-green-500 mt-1 mr-1 flex-shrink-0" />
                      <p className="text-gray-700 truncate">Pickup: {booking.pickupLocation.address || 'Location pin'}</p>
                    </div>
                    <div className="flex items-start">
                      <Navigation size={14} className="text-red-500 mt-1 mr-1 flex-shrink-0" />
                      <p className="text-gray-700 truncate">Dropoff: {booking.dropoffLocation.address || 'Location pin'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-3 flex justify-between">
                    <span className="text-xs text-gray-500">{booking.distance.toFixed(1)} km</span>
                    <button 
                      className="text-sm text-indigo-600 hover:text-indigo-800"
                      onClick={(e) => {
                        e.stopPropagation();
                        // Update status logic would go here
                      }}
                    >
                      {booking.status === 'accepted' ? 'Start Trip' : 'Complete Trip'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* New Booking Requests */}
        <div>
          <h2 className="text-lg font-semibold text-gray-800 mb-3">New Requests</h2>
          
          {pendingBookings.length === 0 ? (
            <div className="bg-gray-50 rounded-lg p-6 text-center">
              <Clock size={40} className="mx-auto text-gray-400 mb-2" />
              <p className="text-gray-500">No new booking requests</p>
              <p className="text-sm text-gray-400 mt-1">New requests will appear here</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pendingBookings.map(booking => (
                <div key={booking.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800 mb-2">
                        New Request
                      </span>
                      <h3 className="font-medium">{booking.loadType}</h3>
                      <p className="text-sm text-gray-500">{booking.weight}kg • {booking.vehicleType}</p>
                    </div>
                    <p className="text-lg font-bold">₹{booking.fare}</p>
                  </div>
                  
                  <div className="mt-3 text-sm">
                    <div className="flex items-start mb-1">
                      <MapPin size={14} className="text-green-500 mt-1 mr-1 flex-shrink-0" />
                      <p className="text-gray-700 truncate">Pickup: {booking.pickupLocation.address || 'Location pin'}</p>
                    </div>
                    <div className="flex items-start">
                      <Navigation size={14} className="text-red-500 mt-1 mr-1 flex-shrink-0" />
                      <p className="text-gray-700 truncate">Dropoff: {booking.dropoffLocation.address || 'Location pin'}</p>
                    </div>
                  </div>
                  
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => handleAcceptBooking(booking.id)}
                      disabled={isLoading}
                      className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <CheckCircle size={16} className="mr-1" />
                      Accept
                    </button>
                    <button
                      disabled={isLoading}
                      className="flex-1 bg-white text-gray-700 border border-gray-300 py-2 px-4 rounded-md font-medium hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      <XCircle size={16} className="mr-1" />
                      Decline
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {/* Map Container */}
      <div className="flex-1 relative">
        <Map
          currentLocation={user?.location}
          pickupLocation={selectedBooking?.pickupLocation}
          dropoffLocation={selectedBooking?.dropoffLocation}
          showDirections={!!selectedBooking}
        />
        
        {/* Selected Booking Info */}
        {selectedBooking && (
          <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-white p-4 rounded-lg shadow-md z-10">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-medium">{selectedBooking.loadType}</h3>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                selectedBooking.status === 'accepted' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
              }`}>
                {selectedBooking.status}
              </span>
            </div>
            
            <div className="flex items-center text-sm mb-2">
              <Package size={14} className="mr-1" />
              <span>{selectedBooking.weight}kg • {selectedBooking.distance.toFixed(1)} km</span>
            </div>
            
            <div className="space-y-1 text-sm mb-3">
              <div className="flex items-start">
                <MapPin size={14} className="text-green-500 mt-1 mr-1 flex-shrink-0" />
                <p className="text-gray-700">{selectedBooking.pickupLocation.address || 'Pickup location'}</p>
              </div>
              <div className="flex items-start">
                <Navigation size={14} className="text-red-500 mt-1 mr-1 flex-shrink-0" />
                <p className="text-gray-700">{selectedBooking.dropoffLocation.address || 'Dropoff location'}</p>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="font-bold text-lg">₹{selectedBooking.fare}</span>
              <button className="bg-indigo-600 text-white py-2 px-4 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors">
                {selectedBooking.status === 'accepted' ? 'Start Trip' : 'Complete Trip'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverDashboard;