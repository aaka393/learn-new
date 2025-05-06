import React, { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { z } from 'zod';
import { User, UserRole } from '../types';
import { Truck, User as UserIcon, Mail, Lock, Phone } from 'lucide-react';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 characters'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['customer', 'driver']),
});

type ValidationErrors = {
  [key: string]: string;
};

interface AuthFormsProps {
  defaultTab?: 'login' | 'register';
  onSuccess?: () => void;
}

const AuthForms: React.FC<AuthFormsProps> = ({ defaultTab = 'login', onSuccess }) => {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>(defaultTab);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const { login, register, isLoading, error, clearError } = useAuthStore();

  // Login form state
  const [loginData, setLoginData] = useState({
    email: '',
    password: '',
  });

  // Register form state
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'customer' as UserRole,
  });

  const handleLoginChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setLoginData(prev => ({ ...prev, [name]: value }));
    clearError();
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleRegisterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setRegisterData(prev => ({ ...prev, [name]: value }));
    clearError();
    
    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      loginSchema.parse(loginData);
      setErrors({});
      
      // Attempt login
      await login(loginData.email, loginData.password);
      
      // Call onSuccess callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more usable format
        const formattedErrors: ValidationErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          formattedErrors[path] = err.message;
        });
        setErrors(formattedErrors);
      }
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      registerSchema.parse(registerData);
      setErrors({});
      
      // Attempt registration
      const userData: Partial<User> = {
        name: registerData.name,
        email: registerData.email,
        phone: registerData.phone,
        role: registerData.role,
      };
      
      await register(userData, registerData.password);
      
      // Call onSuccess callback if provided
      if (onSuccess) onSuccess();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more usable format
        const formattedErrors: ValidationErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as string;
          formattedErrors[path] = err.message;
        });
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <div className="flex justify-center mb-6">
        <div className="flex items-center">
          <Truck size={32} className="text-indigo-600 mr-3" />
          <h1 className="text-2xl font-bold text-gray-800">RideShare</h1>
        </div>
      </div>
      
      {/* Tabs */}
      <div className="flex mb-6">
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === 'login'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 border-b border-gray-200 hover:text-gray-700'
          }`}
          onClick={() => {
            setActiveTab('login');
            clearError();
            setErrors({});
          }}
        >
          Login
        </button>
        <button
          className={`flex-1 py-2 text-center font-medium ${
            activeTab === 'register'
              ? 'text-indigo-600 border-b-2 border-indigo-600'
              : 'text-gray-500 border-b border-gray-200 hover:text-gray-700'
          }`}
          onClick={() => {
            setActiveTab('register');
            clearError();
            setErrors({});
          }}
        >
          Register
        </button>
      </div>
      
      {/* Error message from auth store */}
      {error && (
        <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md text-sm">
          {error}
        </div>
      )}
      
      {/* Login Form */}
      {activeTab === 'login' && (
        <form onSubmit={handleLoginSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={loginData.email}
                  onChange={handleLoginChange}
                  className={`pl-10 block w-full rounded-md border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={loginData.password}
                  onChange={handleLoginChange}
                  className={`pl-10 block w-full rounded-md border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                  Remember me
                </label>
              </div>
              
              <div className="text-sm">
                <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                  Forgot password?
                </a>
              </div>
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>
        </form>
      )}
      
      {/* Register Form */}
      {activeTab === 'register' && (
        <form onSubmit={handleRegisterSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <UserIcon size={16} className="text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={registerData.name}
                  onChange={handleRegisterChange}
                  className={`pl-10 block w-full rounded-md border ${
                    errors.name ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="John Doe"
                />
              </div>
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={registerData.email}
                  onChange={handleRegisterChange}
                  className={`pl-10 block w-full rounded-md border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="you@example.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Phone size={16} className="text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={registerData.phone}
                  onChange={handleRegisterChange}
                  className={`pl-10 block w-full rounded-md border ${
                    errors.phone ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="1234567890"
                />
              </div>
              {errors.phone && (
                <p className="mt-1 text-sm text-red-600">{errors.phone}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock size={16} className="text-gray-400" />
                </div>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={registerData.password}
                  onChange={handleRegisterChange}
                  className={`pl-10 block w-full rounded-md border ${
                    errors.password ? 'border-red-300' : 'border-gray-300'
                  } shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500`}
                  placeholder="••••••"
                />
              </div>
              {errors.password && (
                <p className="mt-1 text-sm text-red-600">{errors.password}</p>
              )}
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                I want to
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div
                  className={`border rounded-md p-3 cursor-pointer transition-all ${
                    registerData.role === 'customer'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-300'
                  }`}
                  onClick={() => handleRegisterChange({ target: { name: 'role', value: 'customer' } } as React.ChangeEvent<HTMLInputElement>)}
                >
                  <div className="font-medium text-center">Book Rides</div>
                  <div className="text-xs text-gray-500 text-center">Register as Customer</div>
                </div>
                <div
                  className={`border rounded-md p-3 cursor-pointer transition-all ${
                    registerData.role === 'driver'
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 hover:border-indigo-300'
                  }`}
                  onClick={() => handleRegisterChange({ target: { name: 'role', value: 'driver' } } as React.ChangeEvent<HTMLInputElement>)}
                >
                  <div className="font-medium text-center">Drive</div>
                  <div className="text-xs text-gray-500 text-center">Register as Driver</div>
                </div>
              </div>
              {errors.role && (
                <p className="mt-1 text-sm text-red-600">{errors.role}</p>
              )}
            </div>
            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating account...' : 'Create account'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default AuthForms;