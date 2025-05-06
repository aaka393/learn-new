import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { AuthState, User, UserRole } from '../types';
import { api } from '../services/api';

interface AuthActions {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>, password: string) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  updateUserLocation: (lat: number, lng: number) => void;
  clearError: () => void;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

export const useAuthStore = create<AuthState & AuthActions>()(
  persist(
    (set, get) => ({
      ...initialState,

      login: async (email: string, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // This would be a real API call in production
          const response = await api.post('/auth/login', { email, password });
          const { user, token } = response.data;
          
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Login failed' 
          });
          throw error;
        }
      },

      register: async (userData: Partial<User>, password: string) => {
        try {
          set({ isLoading: true, error: null });
          
          // This would be a real API call in production
          const response = await api.post('/auth/register', { ...userData, password });
          const { user, token } = response.data;
          
          set({ 
            user, 
            token, 
            isAuthenticated: true, 
            isLoading: false 
          });
        } catch (error) {
          set({ 
            isLoading: false, 
            error: error instanceof Error ? error.message : 'Registration failed' 
          });
          throw error;
        }
      },

      logout: () => {
        set(initialState);
      },

      refreshToken: async () => {
        const { token } = get();
        if (!token) return;

        try {
          set({ isLoading: true });
          
          // This would be a real API call in production
          const response = await api.post('/auth/refresh', { token });
          const { newToken } = response.data;
          
          set({ token: newToken, isLoading: false });
        } catch (error) {
          // If token refresh fails, log the user out
          set(initialState);
        }
      },

      updateUserLocation: (lat: number, lng: number) => {
        const { user } = get();
        if (!user) return;

        set({
          user: {
            ...user,
            location: { lat, lng }
          }
        });

        // In a real app, we would also send this to the backend
        api.post('/users/location', { lat, lng }).catch(console.error);
      },

      clearError: () => {
        set({ error: null });
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ 
        user: state.user, 
        token: state.token, 
        isAuthenticated: state.isAuthenticated 
      }),
    }
  )
);