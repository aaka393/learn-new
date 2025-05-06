export type UserRole = 'customer' | 'driver' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  location?: {
    lat: number;
    lng: number;
  };
  vehicleDetails?: VehicleDetails;
}

export interface VehicleDetails {
  type: string;
  licensePlate: string;
  model: string;
  capacity: number;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Location {
  lat: number;
  lng: number;
  address?: string;
}

export interface BookingFormData {
  pickupLocation: Location | null;
  dropoffLocation: Location | null;
  loadType: string;
  weight: number;
  vehicleType: string;
  instructions: string;
}

export interface Vehicle {
  id: string;
  title: string;
  capacity: number;
  baseFare: number;
  perKmRate: number;
  iconUrl: string;
}

export interface Booking {
  id: string;
  customerId: string;
  driverId?: string;
  pickupLocation: Location;
  dropoffLocation: Location;
  vehicleType: string;
  status: 'pending' | 'accepted' | 'in-progress' | 'completed' | 'cancelled';
  fare: number;
  distance: number;
  createdAt: string;
  loadType: string;
  weight: number;
  instructions: string;
}