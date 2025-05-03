import { XMarkIcon } from '@heroicons/react/24/solid';

interface PDFPreviewProps {
  onClose: () => void;
}

export function PDFPreview({ onClose }: PDFPreviewProps) {
  return (
    <div className="fixed inset-0 z-150 flex items-center justify-center bg-black bg-opacity-50">
      <div className="relative w-[90vw] h-[90vh] bg-white rounded-lg shadow-xl">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100"
        >
          <XMarkIcon className="w-6 h-6 text-gray-600" />
        </button>
        <iframe
          src={""}
          title="PDF Preview"
          className="w-full h-full rounded-lg"
        />
      </div>
    </div>
  );
}
