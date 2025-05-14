import { useEffect, useState } from "react";
import { getNextGENAlbum } from "../services/api";

const GalleryViewer = () => {
  const [images, setImages] = useState<any[]>([]);

  useEffect(() => {
    getNextGENAlbum().then((data) => {
      const allImages = data.galleries.flatMap((g: any) => g.images);
      setImages(allImages);
    });
  }, []);

  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <iframe
  src="http://192.168.0.104:8001/your-gallery-page"
  className="w-full h-screen border-none"
  title="Dream Album"
/>

      {images.map((img, idx) => (
        <img
          key={idx}
          src={img.url}
          alt={img.title || "Gallery image"}
          className="w-full rounded shadow"
        />
      ))}
    </div>
  );
};

export default GalleryViewer;
