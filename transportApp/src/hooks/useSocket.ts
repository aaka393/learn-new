import { useEffect, useRef, useState, useCallback } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '../store/authStore';
import { useBookingStore } from '../store/bookingStore';
import { Booking } from '../types';

interface UseSocketReturn {
  isConnected: boolean;
  error: string | null;
  sendLocation: (lat: number, lng: number) => void;
}

export const useSocket = (): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, token } = useAuthStore();
  const { updateBookingStatus } = useBookingStore();

  // Initialize socket connection
  useEffect(() => {
    if (!user || !token) return;

    const socketUrl = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';
    
    socketRef.current = io(socketUrl, {
      auth: { token },
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    // Socket event handlers
    socketRef.current.on('connect', () => {
      setIsConnected(true);
      setError(null);
      console.log('Socket connected');
      
      // Join room based on user role and ID
      socketRef.current?.emit('join', { userId: user.id, role: user.role });
    });

    socketRef.current.on('disconnect', () => {
      setIsConnected(false);
      console.log('Socket disconnected');
    });

    socketRef.current.on('connect_error', (err) => {
      setError(`Connection error: ${err.message}`);
      console.error('Socket connection error:', err);
    });

    // Handle booking updates
    socketRef.current.on('booking:update', (updatedBooking: Booking) => {
      updateBookingStatus(updatedBooking.id, updatedBooking.status);
    });

    // Handle new booking (for drivers)
    socketRef.current.on('booking:new', (newBooking: Booking) => {
      if (user.role === 'driver') {
        // Add to current bookings if it's a new booking
        useBookingStore.setState((state) => ({
          currentBookings: [...state.currentBookings, newBooking]
        }));
      }
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
      }
    };
  }, [user, token, updateBookingStatus]);

  // Send location updates (primarily for drivers)
  const sendLocation = useCallback((lat: number, lng: number) => {
    if (socketRef.current && isConnected && user) {
      socketRef.current.emit('location:update', { userId: user.id, lat, lng });
      
      // Also update in local state
      useAuthStore.getState().updateUserLocation(lat, lng);
    }
  }, [isConnected, user]);

  return { isConnected, error, sendLocation };
};