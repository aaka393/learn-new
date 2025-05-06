import React from 'react';
import { z } from 'zod';
import { useBookingStore } from '../store/bookingStore';
import { Truck, Package, Info, MapPin } from 'lucide-react';

// Validation schema
const bookingSchema = z.object({
  pickupLocation: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional(),
  }).nullable().refine(val => val !== null, {
    message: "Pickup location is required",
  }),
  dropoffLocation: z.object({
    lat: z.number(),
    lng: z.number(),
    address: z.string().optional(),
  }).nullable().refine(val => val !== null, {
    message: "Dropoff location is required",
  }),
  loadType: z.string().min(1, "Load type is required"),
  weight: z.number().min(1, "Weight must be at least 1 kg"),
  vehicleType: z.string().min(1, "Vehicle type is required"),
  instructions: z.string().optional(),
});

type ValidationErrors = {
  [K in keyof z.infer<typeof bookingSchema>]?: string;
};

const loadTypes = [
  { id: 'furniture', name: 'Furniture' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'groceries', name: 'Groceries' },
  { id: 'construction', name: 'Construction Materials' },
  { id: 'other', name: 'Other' },
];

const vehicleTypes = [
  { id: 'bike', name: 'Bike', capacity: 10, baseFare: 50, perKmRate: 5 },
  { id: 'scooter', name: 'Scooter', capacity: 25, baseFare: 80, perKmRate: 8 },
  { id: 'car', name: 'Car', capacity: 100, baseFare: 120, perKmRate: 12 },
  { id: 'van', name: 'Van', capacity: 500, baseFare: 200, perKmRate: 20 },
  { id: 'truck', name: 'Truck', capacity: 1000, baseFare: 300, perKmRate: 30 },
];

interface BookingFormProps {
  onSubmit: () => void;
}

const BookingForm: React.FC<BookingFormProps> = ({ onSubmit }) => {
  const { formData, updateFormField } = useBookingStore();
  const [errors, setErrors] = React.useState<ValidationErrors>({});
  const [estimatedPrice, setEstimatedPrice] = React.useState<number | null>(null);

  // Calculate estimated price based on distance and vehicle type
  React.useEffect(() => {
    if (formData.pickupLocation && formData.dropoffLocation && formData.vehicleType) {
      // In a real app, we would call a directions API to get the actual distance
      // For now, we'll use a simple calculation based on the coordinates
      const lat1 = formData.pickupLocation.lat;
      const lon1 = formData.pickupLocation.lng;
      const lat2 = formData.dropoffLocation.lat;
      const lon2 = formData.dropoffLocation.lng;
      
      // Haversine formula to calculate distance between two points
      const R = 6371; // Radius of the earth in km
      const dLat = (lat2 - lat1) * Math.PI / 180;
      const dLon = (lon2 - lon1) * Math.PI / 180;
      const a = 
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
        Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      const distance = R * c; // Distance in km
      
      // Find the selected vehicle
      const vehicle = vehicleTypes.find(v => v.id === formData.vehicleType);
      
      if (vehicle) {
        // Calculate price based on base fare and per km rate
        const price = vehicle.baseFare + (distance * vehicle.perKmRate);
        setEstimatedPrice(Math.round(price));
      }
    } else {
      setEstimatedPrice(null);
    }
  }, [formData.pickupLocation, formData.dropoffLocation, formData.vehicleType]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      bookingSchema.parse(formData);
      setErrors({});
      onSubmit();
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Convert Zod errors to a more usable format
        const formattedErrors: ValidationErrors = {};
        error.errors.forEach((err) => {
          const path = err.path[0] as keyof ValidationErrors;
          formattedErrors[path] = err.message;
        });
        setErrors(formattedErrors);
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Book a Delivery</h2>
      
      {/* Locations */}
      <div className="space-y-4">
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <MapPin size={16} className="mr-1 text-green-500" />
            Pickup Location
          </label>
          {formData.pickupLocation ? (
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm">
                Lat: {formData.pickupLocation.lat.toFixed(6)}, 
                Lng: {formData.pickupLocation.lng.toFixed(6)}
              </p>
              {formData.pickupLocation.address && (
                <p className="text-sm text-gray-600 mt-1">{formData.pickupLocation.address}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-red-500">Please select a pickup location on the map</p>
          )}
          {errors.pickupLocation && (
            <p className="text-sm text-red-500 mt-1">{errors.pickupLocation}</p>
          )}
        </div>
        
        <div>
          <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
            <MapPin size={16} className="mr-1 text-red-500" />
            Dropoff Location
          </label>
          {formData.dropoffLocation ? (
            <div className="p-3 bg-gray-50 rounded border border-gray-200">
              <p className="text-sm">
                Lat: {formData.dropoffLocation.lat.toFixed(6)}, 
                Lng: {formData.dropoffLocation.lng.toFixed(6)}
              </p>
              {formData.dropoffLocation.address && (
                <p className="text-sm text-gray-600 mt-1">{formData.dropoffLocation.address}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-red-500">Please select a dropoff location on the map</p>
          )}
          {errors.dropoffLocation && (
            <p className="text-sm text-red-500 mt-1">{errors.dropoffLocation}</p>
          )}
        </div>
      </div>
      
      {/* Load Type */}
      <div>
        <label htmlFor="loadType" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          <Package size={16} className="mr-1" />
          Load Type
        </label>
        <select
          id="loadType"
          value={formData.loadType}
          onChange={(e) => updateFormField('loadType', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
        >
          <option value="">Select load type</option>
          {loadTypes.map((type) => (
            <option key={type.id} value={type.id}>
              {type.name}
            </option>
          ))}
        </select>
        {errors.loadType && (
          <p className="text-sm text-red-500 mt-1">{errors.loadType}</p>
        )}
      </div>
      
      {/* Weight */}
      <div>
        <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">
          Weight (kg)
        </label>
        <input
          type="number"
          id="weight"
          min="1"
          value={formData.weight || ''}
          onChange={(e) => updateFormField('weight', Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
        />
        {errors.weight && (
          <p className="text-sm text-red-500 mt-1">{errors.weight}</p>
        )}
      </div>
      
      {/* Vehicle Type */}
      <div>
        <label htmlFor="vehicleType" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          <Truck size={16} className="mr-1" />
          Vehicle Type
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 mt-2">
          {vehicleTypes.map((vehicle) => (
            <div
              key={vehicle.id}
              className={`border rounded-lg p-3 cursor-pointer transition-all ${
                formData.vehicleType === vehicle.id
                  ? 'border-indigo-500 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
              onClick={() => updateFormField('vehicleType', vehicle.id)}
            >
              <div className="font-medium">{vehicle.name}</div>
              <div className="text-sm text-gray-500">Up to {vehicle.capacity}kg</div>
              <div className="text-sm text-gray-500">
                ₹{vehicle.baseFare} + ₹{vehicle.perKmRate}/km
              </div>
            </div>
          ))}
        </div>
        {errors.vehicleType && (
          <p className="text-sm text-red-500 mt-1">{errors.vehicleType}</p>
        )}
      </div>
      
      {/* Instructions */}
      <div>
        <label htmlFor="instructions" className="flex items-center text-sm font-medium text-gray-700 mb-1">
          <Info size={16} className="mr-1" />
          Additional Instructions
        </label>
        <textarea
          id="instructions"
          value={formData.instructions}
          onChange={(e) => updateFormField('instructions', e.target.value)}
          rows={3}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 p-2 border"
          placeholder="Any special instructions for the driver..."
        />
      </div>
      
      {/* Price Estimate */}
      {estimatedPrice !== null && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-4">
          <h3 className="font-medium text-indigo-800">Estimated Price</h3>
          <p className="text-2xl font-bold text-indigo-900">₹{estimatedPrice}</p>
          <p className="text-xs text-indigo-700 mt-1">
            Final price may vary based on actual distance and waiting time
          </p>
        </div>
      )}
      
      {/* Submit Button */}
      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-md font-medium hover:bg-indigo-700 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Book Now
      </button>
    </form>
  );
};

export default BookingForm;