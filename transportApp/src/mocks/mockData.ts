import { Booking, Vehicle } from '../types';

// Mock vehicles
export const mockVehicles: Vehicle[] = [
  {
    id: 'v1',
    title: 'Bike',
    capacity: 10,
    baseFare: 50,
    perKmRate: 5,
    iconUrl: '/bike.svg',
  },
  {
    id: 'v2',
    title: 'Scooter',
    capacity: 25,
    baseFare: 80,
    perKmRate: 8,
    iconUrl: '/scooter.svg',
  },
  {
    id: 'v3',
    title: 'Car',
    capacity: 100,
    baseFare: 120,
    perKmRate: 12,
    iconUrl: '/car.svg',
  },
  {
    id: 'v4',
    title: 'Van',
    capacity: 500,
    baseFare: 200,
    perKmRate: 20,
    iconUrl: '/van.svg',
  },
  {
    id: 'v5',
    title: 'Truck',
    capacity: 1000,
    baseFare: 300,
    perKmRate: 30,
    iconUrl: '/truck.svg',
  },
];

// Mock bookings
export const mockBookings: Booking[] = [
  {
    id: 'b1',
    customerId: 'c1',
    driverId: 'd1',
    pickupLocation: {
      lat: 12.9716,
      lng: 77.5946,
      address: '100 MG Road, Bangalore',
    },
    dropoffLocation: {
      lat: 12.9352,
      lng: 77.6245,
      address: '200 Koramangala, Bangalore',
    },
    vehicleType: 'Car',
    status: 'pending',
    fare: 250,
    distance: 8.5,
    createdAt: new Date().toISOString(),
    loadType: 'Furniture',
    weight: 50,
    instructions: 'Handle with care',
  },
  {
    id: 'b2',
    customerId: 'c1',
    driverId: 'd2',
    pickupLocation: {
      lat: 12.9716,
      lng: 77.5946,
      address: '100 MG Road, Bangalore',
    },
    dropoffLocation: {
      lat: 13.0827,
      lng: 77.5858,
      address: '300 Yelahanka, Bangalore',
    },
    vehicleType: 'Van',
    status: 'accepted',
    fare: 450,
    distance: 15.2,
    createdAt: new Date().toISOString(),
    loadType: 'Electronics',
    weight: 120,
    instructions: 'Fragile items',
  },
  {
    id: 'b3',
    customerId: 'c2',
    driverId: 'd1',
    pickupLocation: {
      lat: 12.9352,
      lng: 77.6245,
      address: '200 Koramangala, Bangalore',
    },
    dropoffLocation: {
      lat: 12.9766,
      lng: 77.5993,
      address: '400 Indiranagar, Bangalore',
    },
    vehicleType: 'Bike',
    status: 'completed',
    fare: 120,
    distance: 4.8,
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    loadType: 'Groceries',
    weight: 8,
    instructions: '',
  },
];