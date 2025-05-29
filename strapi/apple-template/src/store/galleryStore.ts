import { create } from 'zustand';
import { Media } from '../types/albums';

interface GalleryState {
  selectedImage: Media | null;
  setSelectedImage: (image: Media | null) => void;
}

export const useGalleryStore = create<GalleryState>((set) => ({
  selectedImage: null,
  setSelectedImage: (image) => set({ selectedImage: image }),
}));