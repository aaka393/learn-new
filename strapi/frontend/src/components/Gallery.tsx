import { useState, useEffect } from 'react';
import { fetchGalleryImages } from '../services/service';
import { baseUrl } from '../constants/appConstants';

const Gallery = () => {
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
    console.log(images)

  useEffect(() => {
    const loadImages = async () => {
      try {
        const fetchedImages = await fetchGalleryImages();
        setImages(fetchedImages);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to load gallery images. Please try again.');
        setLoading(false);
      }
    };

    loadImages();
  }, []);

  if (loading) {
    return <div className="text-center py-12 text-gray-600">Loading gallery images...</div>;
  }

  if (error) {
    return <div className="text-center py-12 text-red-500">{error}</div>;
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image) => (
          <div key={image.id} className="rounded-2xl shadow-md overflow-hidden cursor-pointer">
            <img
              src={`${baseUrl}${image.url}`}
              alt={image.name}
              className="w-full h-48 object-cover transition-transform duration-300 hover:scale-110"
            />
            <div className="p-4">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-200">{image.name}</h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm">{image.caption || ''}</p>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Gallery;
