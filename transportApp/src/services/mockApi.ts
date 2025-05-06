import { mockBookings, mockVehicles } from '../mocks/mockData';
import { Booking, Location, User, Vehicle } from '../types';

// Helper to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Mock API service
export const mockApiService = {
  // Auth
  login: async (email: string, password: string) => {
    await delay(1000);
    
    // Simple validation
    if (email === 'customer@example.com' && password === 'password') {
      return {
        user: {
          id: 'c1',
          name: 'John Customer',
          email: 'customer@example.com',
          phone: '1234567890',
          role: 'customer' as const,
          location: {
            lat: 12.9716,
            lng: 77.5946,
          },
        },
        token: 'mock-jwt-token-customer',
      };
    } else if (email === 'driver@example.com' && password === 'password') {
      return {
        user: {
          id: 'd1',
          name: 'Jane Driver',
          email: 'driver@example.com',
          phone: '0987654321',
          role: 'driver' as const,
          location: {
            lat: 12.9352,
            lng: 77.6245,
          },
          vehicleDetails: {
            type: 'Car',
            licensePlate: 'KA01AB1234',
            model: 'Toyota Innova',
            capacity: 100,
          },
        },
        token: 'mock-jwt-token-driver',
      };
    }
    
    throw new Error('Invalid credentials');
  },
  
  register: async (userData: Partial<User>, password: string) => {
    await delay(1500);
    
    // Simple validation
    if (!userData.email || !userData.name || !userData.phone || !userData.role || !password) {
      throw new Error('All fields are required');
    }
    
    // Create a mock user
    const user: User = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      location: {
        lat: 12.9716,
        lng: 77.5946,
      },
    };
    
    return {
      user,
      token: `mock-jwt-token-${userData.role}`,
    };
  },
  
  // Vehicles
  getVehicles: async (): Promise<Vehicle[]> => {
    await delay(800);
    return mockVehicles;
  },
  
  // Bookings
  createBooking: async (bookingData: any): Promise<Booking> => {
    await delay(1200);
    
    const newBooking: Booking = {
      id: `booking-${Date.now()}`,
      customerId: 'c1', // Assuming logged in user
      pickupLocation: bookingData.pickupLocation,
      dropoffLocation: bookingData.dropoffLocation,
      vehicleType: bookingData.vehicleType,
      loadType: bookingData.loadType,
      weight: bookingData.weight,
      instructions: bookingData.instructions,
      status: 'pending',
      fare: Math.floor(Math.random() * 500) + 100, // Random fare between 100-600
      distance: Math.floor(Math.random() * 20) + 1, // Random distance between 1-20 km
      createdAt: new Date().toISOString(),
    };
    
    return newBooking;
  },
  
  getBookings: async (): Promise<{ current: Booking[], past: Booking[] }> => {
    await delay(1000);
    
    // Split bookings into current and past
    const current = mockBookings.filter(b => ['pending', 'accepted', 'in-progress'].includes(b.status));
    const past = mockBookings.filter(b => ['completed', 'cancelled'].includes(b.status));
    
    return { current, past };
  },
  
  getBooking: async (id: string): Promise<Booking> => {
    await delay(800);
    
    const booking = mockBookings.find(b => b.id === id);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    return booking;
  },
  
  acceptBooking: async (id: string): Promise<void> => {
    await delay(1000);
    
    const booking = mockBookings.find(b => b.id === id);
    
    if (!booking) {
      throw new Error('Booking not found');
    }
    
    booking.status = 'accepted';
    booking.driverId = 'd1'; // Assuming logged in driver
  },
  
  // Location
  updateLocation: async (lat: number, lng: number): Promise<void> => {
    await delay(500);
    // In a real app, this would update the user's location in the database
  },
  
  // Directions
  getDirections: async (origin: Location, destination: Location): Promise<{
    distance: number;
    duration: number;
    route: Location[];
  }> => {
    await delay(1000);
    
    // Generate a simple straight line path between origin and destination
    const steps = 10;
    const route: Location[] = [];
    
    for (let i = 0; i <= steps; i++) {
      const lat = origin.lat + (destination.lat - origin.lat) * (i / steps);
      const lng = origin.lng + (destination.lng - origin.lng) * (i / steps);
      route.push({ lat, lng });
    }
    
    // Calculate distance using Haversine formula
    const R = 6371; // Radius of the earth in km
    const dLat = (destination.lat - origin.lat) * Math.PI / 180;
    const dLon = (destination.lng - origin.lng) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(origin.lat * Math.PI / 180) * Math.cos(destination.lat * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    const distance = R * c;
    
    // Estimate duration (assuming 30 km/h average speed)
    const duration = (distance / 30) * 60; // minutes
    
    return {
      distance,
      duration,
      route,
    };
  },
};