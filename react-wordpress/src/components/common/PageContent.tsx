import React from 'react';
import { WordPressPage } from '../../types/wordpress';

interface PageContentProps {
  page: WordPressPage;
}

const PageContent: React.FC<PageContentProps> = ({ page }) => {
  // Extract featured image URL if available
  const featuredImage = page._embedded?.['wp:featuredmedia']?.[0]?.source_url;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="prose prose-blue max-w-none">
        <h1 
          className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6"
          dangerouslySetInnerHTML={{ __html: page.title.rendered }}
        ></h1>
        
        {featuredImage && (
          <img 
            src={featuredImage} 
            alt={page.title.rendered} 
            className="w-full h-auto rounded-lg mb-8 shadow-md"
          />
        )}
        
        <div
          className="wp-content text-gray-700 leading-relaxed"
          dangerouslySetInnerHTML={{ __html: page.content.rendered }}
        ></div>
      </div>
    </div>
  );
};

export default PageContent;