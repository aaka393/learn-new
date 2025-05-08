import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { PaginationInfo } from '../../types/wordpress';

interface PaginationProps {
  pagination: PaginationInfo;
  onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ pagination, onPageChange }) => {
  const { currentPage, totalPages } = pagination;
  
  if (totalPages <= 1) return null;
  
  // Create array of page numbers to show
  const getPageNumbers = () => {
    let pages = [];
    const maxPagesToShow = 5;
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if there are few
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Show a window of pages around current page
      let startPage = Math.max(1, currentPage - 2);
      let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);
      
      // Adjust if we're near the end
      if (endPage - startPage < maxPagesToShow - 1) {
        startPage = Math.max(1, endPage - maxPagesToShow + 1);
      }
      
      for (let i = startPage; i <= endPage; i++) {
        pages.push(i);
      }
      
      // Add first page and ellipsis if needed
      if (startPage > 1) {
        pages = [1, '...', ...pages];
      }
      
      // Add last page and ellipsis if needed
      if (endPage < totalPages) {
        pages = [...pages, '...', totalPages];
      }
    }
    
    return pages;
  };
  
  return (
    <div className="flex justify-center mt-8">
      <nav className="flex items-center space-x-1">
        {/* Previous page button */}
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          className={`px-3 py-2 rounded-md ${
            currentPage <= 1
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          aria-label="Previous page"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        {/* Page numbers */}
        {getPageNumbers().map((page, index) => (
          <React.Fragment key={index}>
            {page === '...' ? (
              <span className="px-3 py-2 text-gray-500">...</span>
            ) : (
              <button
                onClick={() => typeof page === 'number' && onPageChange(page)}
                className={`px-3 py-2 rounded-md ${
                  currentPage === page
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {page}
              </button>
            )}
          </React.Fragment>
        ))}
        
        {/* Next page button */}
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          className={`px-3 py-2 rounded-md ${
            currentPage >= totalPages
              ? 'text-gray-400 cursor-not-allowed'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
          aria-label="Next page"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </nav>
    </div>
  );
};

export default Pagination;