import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

interface RegistryState {
  registries: any[];
  addRegistry: (registry: any) => void;
  updateRegistry: (registry: any) => void;
  removeRegistry: (id: string) => void;
}

export const useRegistryStore = create<RegistryState>()(
  persist(
    (set) => ({
      registries: [],
      addRegistry: (registry) =>
        set((state) => ({ registries: [...state.registries, registry] })),
      updateRegistry: (registry) =>
        set((state) => ({
          registries: state.registries.map((r) => (r.id === registry.id ? registry : r)),
        })),
      removeRegistry: (id) =>
        set((state) => ({
          registries: state.registries.filter((registry) => registry.id !== id),
        })),
    }),
    {
      name: 'registry-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
