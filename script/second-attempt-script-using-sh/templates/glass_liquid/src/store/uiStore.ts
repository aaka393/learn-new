import { create } from 'zustand';
import { UIPreferences } from '../types/contentTypes';

interface UIStore extends UIPreferences {
  setTheme: (theme: 'light' | 'dark') => void;
  setActiveSection: (section: 'home' | 'blog' | 'articles') => void;
  setGlassmorphismIntensity: (intensity: number) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  theme: 'light',
  activeSection: 'home',
  glassmorphismIntensity: 0.1,
  
  setTheme: (theme) => set({ theme }),
  setActiveSection: (section) => set({ activeSection: section }),
  setGlassmorphismIntensity: (intensity) => set({ glassmorphismIntensity: intensity }),
}));