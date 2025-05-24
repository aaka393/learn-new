import React, { useState, useEffect } from 'react';
import { fetchAboutData, getAboutImageUrl } from '../services/service';
import { AboutData, AboutBlock } from '../types/about';
import ReactMarkdown from 'react-markdown';

const About: React.FC = () => {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadAboutData = async () => {
      try {
        const data = await fetchAboutData();
        setAboutData(data);
        document.title = 'About | Yensi Solution';
      } catch (error) {
        console.error('Failed to load about data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadAboutData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!aboutData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load content. Please try again later.</p>
      </div>
    );
  }

  const renderBlock = (block: AboutBlock, index: number) => {
    switch (block.__component) {
      case 'shared.quote':
        return (
          <section 
            key={`${block.__component}-${block.id}`}
            className="py-20 bg-black text-white"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <blockquote className="relative">
                <p className="text-2xl md:text-4xl font-light italic mb-6">"{block.body}"</p>
                <footer className="text-lg md:text-xl font-medium">— {block.title}</footer>
              </blockquote>
            </div>
          </section>
        );
        
      case 'shared.rich-text':
        return (
          <section 
            key={`${block.__component}-${block.id}`}
            className={`py-16 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
              <ReactMarkdown>{block.body}</ReactMarkdown>
            </div>
          </section>
        );
        
      case 'shared.media':
        const imageUrl = getAboutImageUrl(block.media);
        return (
          <section 
            key={`${block.__component}-${block.id}`}
            className="py-16 bg-white"
          >
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              {imageUrl && (
                <div className="rounded-2xl overflow-hidden shadow-xl">
                  <img 
                    src={imageUrl}
                    alt="About Yensi Solution"
                    className="w-full h-auto"
                  />
                </div>
              )}
            </div>
          </section>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="pt-16 md:pt-20">
      <header className="bg-gray-50 py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl md:text-5xl font-bold text-center">About Us</h1>
        </div>
      </header>
      
      {aboutData.blocks.map(renderBlock)}
    </div>
  );
};

export default About;