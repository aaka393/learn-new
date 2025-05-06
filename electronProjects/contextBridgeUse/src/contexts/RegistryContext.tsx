import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Registry } from '../types/registry';
import * as idbKeyval from 'idb-keyval';
import { useRegistryStore } from '../store/registryStore';

interface RegistryContextType {
  registries: Registry[];
  activeRegistry: Registry | null;
  addRegistry: (registry: Omit<Registry, 'id'>) => void;
  updateRegistry: (registry: Registry) => void;
  removeRegistry: (id: string) => void;
  setActiveRegistry: (id: string) => void;
  isLoading: boolean;
}

const RegistryContext = createContext<RegistryContextType | undefined>(undefined);

export const useRegistry = (): RegistryContextType => {
  const context = useContext(RegistryContext);
  if (!context) {
    throw new Error('useRegistry must be used within a RegistryProvider');
  }
  return context;
};

interface RegistryProviderProps {
  children: ReactNode;
}

export const RegistryProvider: React.FC<RegistryProviderProps> = ({ children }) => {
  const { registries: storedRegistries, addRegistry: addRegistryToStore, updateRegistry: updateRegistryToStore, removeRegistry: removeRegistryToStore } = useRegistryStore();
  const [registries, setRegistries] = useState<Registry[]>(storedRegistries);
  const [activeRegistry, setActiveRegistry] = useState<Registry | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadRegistries = async () => {
      setIsLoading(true);
      try {
        //const storedRegistries = await idbKeyval.get<Registry[]>('docker-registries');
        if (storedRegistries) {
          setRegistries(storedRegistries);
          const defaultRegistry = storedRegistries.find((reg: Registry) => reg.isDefault);
          setActiveRegistry(defaultRegistry || storedRegistries[0] || null);
        }
      } catch (error) {
        console.error("Error loading registries from IndexedDB:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadRegistries();
  }, []);

  useEffect(() => {
    const saveRegistries = async () => {
      try {
        await idbKeyval.set('docker-registries', registries);
      } catch (error) {
        console.error("Error saving registries to IndexedDB:", error);
      }
    };

    saveRegistries();
  }, [registries]);

  const addRegistry = (registry: Omit<Registry, 'id'>) => {
    const newRegistry: Registry = {
      ...registry,
      id: Math.random().toString().substring(2, 15)
    };

    if (registries.length === 0) {
      newRegistry.isDefault = true;
    }

    if (newRegistry.isDefault) {
      setRegistries(prev => 
        prev.map(reg => ({
          ...reg,
          isDefault: false
        }))
      );
    }

    setRegistries(prev => [...prev, newRegistry]);
    addRegistryToStore(newRegistry)
    
    if (registries.length === 0 || newRegistry.isDefault) {
      setActiveRegistry(newRegistry);
    }
  };

  const updateRegistry = (updatedRegistry: Registry) => {
    if (updatedRegistry.isDefault) {
      setRegistries(prev => 
        prev.map(reg => ({
          ...reg,
          isDefault: reg.id === updatedRegistry.id
        }))
      );
    } else {
      const currentDefault = registries.find(reg => reg.isDefault);
      if (currentDefault && currentDefault.id === updatedRegistry.id) {
        updatedRegistry.isDefault = true;
      }
    }

    setRegistries(prev => 
      prev.map(reg => (reg.id === updatedRegistry.id ? updatedRegistry : reg))
    );
    updateRegistryToStore(updatedRegistry)

    if (activeRegistry && activeRegistry.id === updatedRegistry.id) {
      setActiveRegistry(updatedRegistry);
    }
  };

  const removeRegistry = (id: string) => {
    const registryToRemove = registries.find(reg => reg.id === id);
    const isDefault = registryToRemove?.isDefault || false;
    
    setRegistries(prev => {
      const newRegistries = prev.filter(reg => reg.id !== id);
      
      if (isDefault && newRegistries.length > 0) {
        newRegistries[0].isDefault = true;
      }
      
      return newRegistries;
    });
    removeRegistryToStore(id)

    if (activeRegistry && activeRegistry.id === id) {
      const remainingRegistries = registries.filter(reg => reg.id !== id);
      const newDefault = remainingRegistries.find(reg => reg.isDefault);
      setActiveRegistry(newDefault || remainingRegistries[0] || null);
    }
  };

  const setActiveRegistryById = (id: string) => {
    const registry = registries.find(reg => reg.id === id);
    if (registry) {
      setActiveRegistry(registry);
    }
  };

  const value: RegistryContextType = {
    registries,
    activeRegistry,
    addRegistry,
    updateRegistry,
    removeRegistry,
    setActiveRegistry: setActiveRegistryById,
    isLoading,
  };

  return <RegistryContext.Provider value={value}>{children}</RegistryContext.Provider>;
};
