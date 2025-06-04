import React, { useState, useEffect } from 'react';
import { fetchGalleryImages } from '../services/service';
import { baseUrl } from '../constants/appConstants';
import { X } from 'lucide-react';

interface GalleryImage {
  id: number;
  name: string;
  alternativeText: string;
  formats: {
    thumbnail?: { url: string };
    small?: { url: string };
    medium?: { url: string };
    large?: { url: string };
  };
  url: string;
}

const Gallery: React.FC = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<GalleryImage | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const data = await fetchGalleryImages();
        // Filter only image files
        const imageFiles = data.filter(file => 
          file.mime?.startsWith('image/') && 
          file.formats // Ensure it has formats (it's an image with thumbnails)
        );
        setImages(imageFiles);
        document.title = 'Gallery | Yensi Solution';
      } catch (error) {
        console.error('Failed to load gallery images:', error);
      } finally {
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  const openModal = (image: GalleryImage) => {
    setSelectedImage(image);
    // Prevent scrolling when modal is open
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    setSelectedImage(null);
    // Re-enable scrolling
    document.body.style.overflow = 'auto';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  return (
    <div className="pt-16 md:pt-20">
      <header className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center mb-6">Gallery</h1>
          <p className="text-xl text-gray-600 text-center max-w-3xl mx-auto">
            Explore our collection of project images and behind-the-scenes moments
          </p>
        </div>
      </header>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {images.length === 0 ? (
          <p className="text-center text-gray-600">No images available.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(image => (
              <div 
                key={image.id} 
                className="relative group cursor-pointer overflow-hidden rounded-lg shadow-md aspect-square"
                onClick={() => openModal(image)}
              >
                <img 
                  src={`${baseUrl}${image.formats.medium?.url || image.formats.small?.url || image.url}`}
                  alt={image.alternativeText || image.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors duration-300"></div>
              </div>
            ))}
          </div>
        )}
      </div>
      
      {/* Image Modal */}
      {selectedImage && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
          onClick={closeModal}
        >
          <button 
            className="absolute top-4 right-4 text-white hover:text-gray-300"
            onClick={closeModal}
          >
            <X className="h-8 w-8" />
          </button>
          
          <div 
            className="max-w-7xl max-h-[90vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <img 
              src={`${baseUrl}${selectedImage.formats.large?.url || selectedImage.url}`}
              alt={selectedImage.alternativeText || selectedImage.name}
              className="max-w-full max-h-[90vh] object-contain mx-auto"
            />
            
            {(selectedImage.alternativeText || selectedImage.name) && (
              <div className="mt-4 text-center text-white">
                <p>{selectedImage.alternativeText || selectedImage.name}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Gallery;