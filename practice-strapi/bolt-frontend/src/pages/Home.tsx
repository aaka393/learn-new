import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchHomepageData } from '../services/service';
import { HomepageData, Block } from '../types/homepage';
import { baseUrl } from '../constants/appConstants';
import { ArrowRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const Home: React.FC = () => {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        const data = await fetchHomepageData();
        setHomepageData(data);
        // Update document title with SEO title
        document.title = data.seo_title || 'Yensi Solution';
        // Add meta description if available
        if (data.seo_description) {
          const metaDescription = document.querySelector('meta[name="description"]');
          if (metaDescription) {
            metaDescription.setAttribute('content', data.seo_description);
          } else {
            const meta = document.createElement('meta');
            meta.name = 'description';
            meta.content = data.seo_description;
            document.getElementsByTagName('head')[0].appendChild(meta);
          }
        }
      } catch (error) {
        console.error('Failed to load homepage data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadHomepageData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
      </div>
    );
  }

  if (!homepageData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Failed to load content. Please try again later.</p>
      </div>
    );
  }

  const renderBlock = (block: Block, index: number) => {
  switch (block.__component) {
    case 'shared.hero':
      return (
        <section 
          key={`${block.__component}-${block.id}`}
          className="min-h-screen relative flex items-start justify-center overflow-hidden"
        >
          {block.backgroundImage && (
            <div className="absolute inset-0 z-0">
              <img 
                src={`${baseUrl}${block.backgroundImage.formats.large?.url || block.backgroundImage.url}`}
                alt="Hero Background"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/30"></div>
            </div>
          )}
          <div className="relative z-10 text-center max-w-4xl mx-auto px-4 py-20">
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
              {block.title || homepageData.title}
            </h1>
            {block.subtitle && (
              <p className="text-xl md:text-2xl text-white/90 mb-8">
                {block.subtitle}
              </p>
            )}
            <Link 
              to={block.buttonUrl ?? '#'}
              className="inline-flex items-center px-6 py-3 text-lg font-medium text-black bg-white rounded-full hover:bg-gray-100 transition-colors duration-300"
            >
              {block.buttonText}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </section>
      );
        
      case 'shared.feature':
        const imageUrl = block.icon.formats.small?.url || block.icon.url;
        return (
          <div 
            key={`${block.__component}-${block.id}`}
            className={`py-20 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col md:flex-row items-center gap-10">
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'order-1' : 'order-1 md:order-2'}`}>
                  <img 
                    src={`${baseUrl}${imageUrl}`}
                    alt={block.title}
                    className="w-full h-auto rounded-2xl shadow-lg"
                  />
                </div>
                <div className={`w-full md:w-1/2 ${index % 2 === 0 ? 'order-2' : 'order-2 md:order-1'}`}>
                  <h2 className="text-3xl font-bold mb-4">{block.title}</h2>
                  <div className="text-gray-600 space-y-4">
                    {block.description.map((paragraph, idx) => (
                      <p key={idx}>{paragraph.children[0].text}</p>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
        
      case 'shared.cta':
        return (
          <section 
            key={`${block.__component}-${block.id}`}
            className="bg-black text-white py-20"
          >
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-8">{block.title}</h2>
              <Link 
                to={block.buttonUrl} 
                className="inline-flex items-center px-8 py-4 text-lg font-medium text-black bg-white rounded-full hover:bg-gray-100 transition-colors duration-300"
              >
                {block.buttonText}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </section>
        );
        
      case 'shared.video-block':
        return (
          <section 
            key={`${block.__component}-${block.id}`}
            className="py-20 bg-gray-50"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-center mb-10">{block.title}</h2>
              <div className="relative aspect-video rounded-2xl overflow-hidden shadow-xl">
                <iframe 
                  src={block.videoUrl}
                  title={block.title}
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </div>
          </section>
        );
        
      case 'shared.rich-text':
        return (
          <section 
            key={`${block.__component}-${block.id}`}
            className="py-20 bg-white"
          >
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-lg">
              <ReactMarkdown>{block.body}</ReactMarkdown>
            </div>
          </section>
        );
        
      default:
        return null;
    }
  };

  return (
    <div className="pt-16 md:pt-20">
      {homepageData.blocks.map(renderBlock)}
    </div>
  );
};

export default Home;