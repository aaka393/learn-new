import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { Location } from '../types';
import { MapPin, Navigation } from 'lucide-react';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with React
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// Custom marker icons
const createCustomIcon = (color: string) => {
  return L.divIcon({
    className: 'custom-icon',
    html: `<div style="background-color: ${color}; width: 24px; height: 24px; border-radius: 50%; display: flex; justify-content: center; align-items: center; color: white; font-size: 14px; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="10" r="3"/><path d="M12 2a8 8 0 0 0-8 8c0 1.892.402 3.13 1.5 4.5L12 22l6.5-7.5c1.098-1.37 1.5-2.608 1.5-4.5a8 8 0 0 0-8-8z"/></svg>
           </div>`,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
    popupAnchor: [0, -24],
  });
};

const pickupIcon = createCustomIcon('#4CAF50'); // Green
const dropoffIcon = createCustomIcon('#F44336'); // Red
const userIcon = createCustomIcon('#2196F3'); // Blue

interface LocationFinderProps {
  onLocationSelected: (location: Location) => void;
}

// Component to recenter map when location changes
const RecenterMap = ({ position }: { position: [number, number] }) => {
  const map = useMap();
  useEffect(() => {
    map.setView(position, map.getZoom());
  }, [position, map]);
  return null;
};

// Component to get current location
const LocationFinder: React.FC<LocationFinderProps> = ({ onLocationSelected }) => {
  const map = useMap();
  
  useEffect(() => {
    map.locate({ setView: true, maxZoom: 16 });
    
    map.on('locationfound', (e) => {
      const { lat, lng } = e.latlng;
      onLocationSelected({ lat, lng });
    });
    
    map.on('locationerror', (e) => {
      console.error('Location error:', e.message);
      // Default to a location if geolocation fails
      onLocationSelected({ lat: 51.505, lng: -0.09 });
    });
  }, [map, onLocationSelected]);
  
  return null;
};

interface MapProps {
  currentLocation?: Location;
  pickupLocation?: Location | null;
  dropoffLocation?: Location | null;
  driverLocation?: Location | null;
  onPickupSelect?: (location: Location) => void;
  onDropoffSelect?: (location: Location) => void;
  isSelectable?: boolean;
  showDirections?: boolean;
}

const Map: React.FC<MapProps> = ({
  currentLocation,
  pickupLocation,
  dropoffLocation,
  driverLocation,
  onPickupSelect,
  onDropoffSelect,
  isSelectable = false,
  showDirections = false,
}) => {
  const [userLocation, setUserLocation] = useState<Location | undefined>(currentLocation);
  const [selectingMode, setSelectingMode] = useState<'pickup' | 'dropoff' | null>(null);

  // Handle map click for location selection
  const handleMapClick = (e: L.LeafletMouseEvent) => {
    if (!isSelectable || !selectingMode) return;
    
    const { lat, lng } = e.latlng;
    const location: Location = { lat, lng };
    
    if (selectingMode === 'pickup' && onPickupSelect) {
      onPickupSelect(location);
    } else if (selectingMode === 'dropoff' && onDropoffSelect) {
      onDropoffSelect(location);
    }
    
    setSelectingMode(null);
  };

  return (
    <div className="relative w-full h-full">
      <MapContainer 
        center={userLocation ? [userLocation.lat, userLocation.lng] : [51.505, -0.09]} 
        zoom={13} 
        style={{ height: '100%', width: '100%', zIndex: 1 }}
        whenCreated={(map) => {
          map.on('click', handleMapClick);
        }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {!userLocation && (
          <LocationFinder onLocationSelected={(loc) => setUserLocation(loc)} />
        )}
        
        {userLocation && (
          <>
            <Marker 
              position={[userLocation.lat, userLocation.lng]} 
              icon={userIcon}
            >
              <Popup>You are here</Popup>
            </Marker>
            <RecenterMap position={[userLocation.lat, userLocation.lng]} />
          </>
        )}
        
        {pickupLocation && (
          <Marker 
            position={[pickupLocation.lat, pickupLocation.lng]} 
            icon={pickupIcon}
          >
            <Popup>Pickup Location</Popup>
          </Marker>
        )}
        
        {dropoffLocation && (
          <Marker 
            position={[dropoffLocation.lat, dropoffLocation.lng]} 
            icon={dropoffIcon}
          >
            <Popup>Dropoff Location</Popup>
          </Marker>
        )}
        
        {driverLocation && (
          <Marker 
            position={[driverLocation.lat, driverLocation.lng]} 
            icon={userIcon}
          >
            <Popup>Driver Location</Popup>
          </Marker>
        )}
      </MapContainer>
      
      {isSelectable && (
        <div className="absolute bottom-4 right-4 z-10 flex flex-col gap-2">
          <button
            onClick={() => setSelectingMode('pickup')}
            className={`p-3 rounded-full shadow-lg ${
              selectingMode === 'pickup' ? 'bg-green-600' : 'bg-green-500'
            } text-white hover:bg-green-600 transition-colors`}
            title="Set pickup location"
          >
            <MapPin size={20} />
          </button>
          <button
            onClick={() => setSelectingMode('dropoff')}
            className={`p-3 rounded-full shadow-lg ${
              selectingMode === 'dropoff' ? 'bg-red-600' : 'bg-red-500'
            } text-white hover:bg-red-600 transition-colors`}
            title="Set dropoff location"
          >
            <Navigation size={20} />
          </button>
        </div>
      )}
      
      {selectingMode && (
        <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-full shadow-lg z-10">
          <p className="text-sm font-medium">
            {selectingMode === 'pickup' ? 'Click on the map to set pickup location' : 'Click on the map to set dropoff location'}
          </p>
        </div>
      )}
    </div>
  );
};

export default Map;