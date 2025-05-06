import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Map from '../components/Map';
import { useSocket } from '../hooks/useSocket';
import { apiService } from '../services/api';
import { Booking, Location } from '../types';
import { MapPin, Navigation, Clock, Package, Phone } from 'lucide-react';

const LiveTracking: React.FC = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const { isConnected } = useSocket();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [driverLocation, setDriverLocation] = useState<Location | null>(null);
  const [estimatedArrival, setEstimatedArrival] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setIsLoading(true);
        
        if (!bookingId) return;
        
        // This would be a real API call in production
        const data = await apiService.get<Booking>(`/bookings/${bookingId}`);
        setBooking(data);
        
        // Simulate driver location
        if (data.pickupLocation) {
          // Start driver a bit away from pickup
          const lat = data.pickupLocation.lat + (Math.random() - 0.5) * 0.01;
          const lng = data.pickupLocation.lng + (Math.random() - 0.5) * 0.01;
          setDriverLocation({ lat, lng });
          
          // Set estimated arrival time (10-15 minutes from now)
          const minutes = Math.floor(Math.random() * 6) + 10;
          const arrivalTime = new Date();
          arrivalTime.setMinutes(arrivalTime.getMinutes() + minutes);
          setEstimatedArrival(arrivalTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
        }
      } catch (err) {
        setError('Failed to load booking details');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBookingDetails();
    
    // Simulate driver movement
    const intervalId = setInterval(() => {
      if (driverLocation && booking) {
        // Move driver closer to pickup or dropoff
        const target = booking.status === 'accepted' ? booking.pickupLocation : booking.dropoffLocation;
        
        if (target) {
          // Calculate direction vector
          const dx = target.lat - driverLocation.lat;
          const dy = target.lng - driverLocation.lng;
          
          // Normalize and scale
          const distance = Math.sqrt(dx * dx + dy * dy);
          const step = 0.0005; // Movement step size
          
          if (distance > 0.001) { // If not too close
            const newLat = driverLocation.lat + (dx / distance) * step;
            const newLng = driverLocation.lng + (dy / distance) * step;
            setDriverLocation({ lat: newLat, lng: newLng });
          }
        }
      }
    }, 2000);
    
    return () => clearInterval(intervalId);
  }, [bookingId, driverLocation, booking]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading tracking information...</p>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex items-center justify-center h-screen bg-gray-100">
        <div className="text-center max-w-md p-6 bg-white rounded-lg shadow-md">
          <div className="text-red-500 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error Loading Tracking</h2>
          <p className="text-gray-600">{error || 'Booking not found'}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white p-4 shadow-sm">
        <div className="container mx-auto">
          <h1 className="text-xl font-bold text-gray-800">Live Tracking</h1>
          <p className="text-sm text-gray-500">Booking #{booking.id.substring(0, 8)}</p>
        </div>
      </div>
      
      {/* Connection Status */}
      <div className={`px-4 py-2 ${isConnected ? 'bg-green-50' : 'bg-red-50'}`}>
        <div className="container mx-auto">
          <p className={`text-sm flex items-center ${isConnected ? 'text-green-700' : 'text-red-700'}`}>
            <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></span>
            {isConnected ? 'Live tracking active' : 'Tracking connection lost'}
          </p>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="flex-1 flex flex-col md:flex-row">
        {/* Map */}
        <div className="flex-1 relative">
          <Map
            pickupLocation={booking.pickupLocation}
            dropoffLocation={booking.dropoffLocation}
            driverLocation={driverLocation || undefined}
            showDirections={true}
          />
        </div>
        
        {/* Tracking Info */}
        <div className="w-full md:w-96 bg-white p-6 overflow-y-auto">
          {/* Status */}
          <div className="mb-6">
            <span className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
              booking.status === 'accepted' ? 'bg-yellow-100 text-yellow-800' : 
              booking.status === 'in-progress' ? 'bg-blue-100 text-blue-800' : 
              'bg-green-100 text-green-800'
            }`}>
              {booking.status === 'accepted' ? 'Driver on the way' : 
               booking.status === 'in-progress' ? 'In transit' : 
               'Completed'}
            </span>
          </div>
          
          {/* ETA */}
          {estimatedArrival && (
            <div className="mb-6 bg-indigo-50 rounded-lg p-4">
              <div className="flex items-center">
                <Clock size={20} className="text-indigo-600 mr-2" />
                <div>
                  <p className="text-sm text-indigo-700">Estimated arrival</p>
                  <p className="text-xl font-bold text-indigo-900">{estimatedArrival}</p>
                </div>
              </div>
            </div>
          )}
          
          {/* Locations */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">TRIP DETAILS</h3>
            <div className="space-y-4">
              <div className="flex">
                <div className="mr-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                    <MapPin size={16} className="text-green-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Pickup Location</p>
                  <p className="text-sm text-gray-500">{booking.pickupLocation.address || 'Selected location'}</p>
                </div>
              </div>
              
              <div className="flex">
                <div className="mr-3">
                  <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center">
                    <Navigation size={16} className="text-red-600" />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700">Dropoff Location</p>
                  <p className="text-sm text-gray-500">{booking.dropoffLocation.address || 'Selected location'}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Package Details */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-3">PACKAGE DETAILS</h3>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <Package size={16} className="text-gray-600 mr-2" />
                <p className="font-medium text-gray-800">{booking.loadType}</p>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <p className="text-gray-500">Weight</p>
                  <p className="font-medium text-gray-800">{booking.weight} kg</p>
                </div>
                <div>
                  <p className="text-gray-500">Vehicle</p>
                  <p className="font-medium text-gray-800">{booking.vehicleType}</p>
                </div>
                <div>
                  <p className="text-gray-500">Distance</p>
                  <p className="font-medium text-gray-800">{booking.distance.toFixed(1)} km</p>
                </div>
                <div>
                  <p className="text-gray-500">Fare</p>
                  <p className="font-medium text-gray-800">₹{booking.fare}</p>
                </div>
              </div>
              {booking.instructions && (
                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-gray-500 text-sm">Instructions</p>
                  <p className="text-gray-800 text-sm">{booking.instructions}</p>
                </div>
              )}
            </div>
          </div>
          
          {/* Driver Contact */}
          <div>
            <h3 className="text-sm font-medium text-gray-500 mb-3">DRIVER</h3>
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-4">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-gray-300 mr-3 flex items-center justify-center text-gray-600">
                  <span className="text-lg font-medium">JD</span>
                </div>
                <div>
                  <p className="font-medium text-gray-800">John Doe</p>
                  <p className="text-sm text-gray-500">Toyota Innova • KA01AB1234</p>
                </div>
              </div>
              <button className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center text-white">
                <Phone size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LiveTracking;