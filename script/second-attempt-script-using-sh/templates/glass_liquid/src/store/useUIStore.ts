import { create } from 'zustand';

interface UIState {
  isDarkMode: boolean;
  isMenuOpen: boolean;
  selectedImage: any | null;
  toggleDarkMode: () => void;
  toggleMenu: () => void;
  setSelectedImage: (image: any | null) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isDarkMode: false,
  isMenuOpen: false,
  selectedImage: null,
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
  setSelectedImage: (image) => set({ selectedImage: image }),
}));