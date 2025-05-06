import { create } from 'zustand';
import { BookingFormData, Location, Booking } from '../types';
import { api } from '../services/api';

interface BookingState {
  formData: BookingFormData;
  currentBookings: Booking[];
  pastBookings: Booking[];
  isLoading: boolean;
  error: string | null;
}

interface BookingActions {
  setPickupLocation: (location: Location) => void;
  setDropoffLocation: (location: Location) => void;
  updateFormField: <K extends keyof BookingFormData>(
    field: K, 
    value: BookingFormData[K]
  ) => void;
  resetForm: () => void;
  createBooking: () => Promise<Booking>;
  fetchBookings: () => Promise<void>;
  acceptBooking: (bookingId: string) => Promise<void>;
  updateBookingStatus: (bookingId: string, status: Booking['status']) => void;
  clearError: () => void;
}

const initialFormData: BookingFormData = {
  pickupLocation: null,
  dropoffLocation: null,
  loadType: '',
  weight: 0,
  vehicleType: '',
  instructions: '',
};

export const useBookingStore = create<BookingState & BookingActions>((set, get) => ({
  formData: initialFormData,
  currentBookings: [],
  pastBookings: [],
  isLoading: false,
  error: null,

  setPickupLocation: (location: Location) => {
    set((state) => ({
      formData: {
        ...state.formData,
        pickupLocation: location,
      },
    }));
  },

  setDropoffLocation: (location: Location) => {
    set((state) => ({
      formData: {
        ...state.formData,
        dropoffLocation: location,
      },
    }));
  },

  updateFormField: (field, value) => {
    set((state) => ({
      formData: {
        ...state.formData,
        [field]: value,
      },
    }));
  },

  resetForm: () => {
    set({ formData: initialFormData });
  },

  createBooking: async () => {
    try {
      set({ isLoading: true, error: null });
      
      const { formData } = get();
      
      // This would be a real API call in production
      const response = await api.post('/bookings', formData);
      const newBooking = response.data;
      
      set((state) => ({
        currentBookings: [...state.currentBookings, newBooking],
        isLoading: false,
      }));
      
      return newBooking;
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to create booking' 
      });
      throw error;
    }
  },

  fetchBookings: async () => {
    try {
      set({ isLoading: true, error: null });
      
      // This would be a real API call in production
      const response = await api.get('/bookings');
      const { current, past } = response.data;
      
      set({ 
        currentBookings: current, 
        pastBookings: past, 
        isLoading: false 
      });
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch bookings' 
      });
    }
  },

  acceptBooking: async (bookingId: string) => {
    try {
      set({ isLoading: true, error: null });
      
      // This would be a real API call in production
      await api.post(`/bookings/${bookingId}/accept`);
      
      set((state) => ({
        currentBookings: state.currentBookings.map(booking => 
          booking.id === bookingId 
            ? { ...booking, status: 'accepted' } 
            : booking
        ),
        isLoading: false,
      }));
    } catch (error) {
      set({ 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Failed to accept booking' 
      });
      throw error;
    }
  },

  updateBookingStatus: (bookingId: string, status: Booking['status']) => {
    set((state) => ({
      currentBookings: state.currentBookings.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status } 
          : booking
      ),
    }));
  },

  clearError: () => {
    set({ error: null });
  },
}));