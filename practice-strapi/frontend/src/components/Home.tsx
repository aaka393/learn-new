import React, { useEffect, useState } from 'react';
import { fetchHomepageData } from '../services/service';
import { HomepageData } from '../types/homepage';
import { baseUrl } from '../constants/appConstants';

const renderRichText = (nodes: any[]): React.ReactNode => {
  if (!nodes) return null;
  return nodes.map((node, i) => {
    if (node.type === 'paragraph') {
      return <p key={i}>{renderRichText(node.children)}</p>;
    }
    if (node.type === 'text') {
      return node.text;
    }
    // Add more node.type cases as needed (bold, italic, links, etc.)
    return null;
  });
};

const Home: React.FC = () => {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);

  useEffect(() => {
    const loadHomepage = async () => {
      const data = await fetchHomepageData();
      setHomepageData(data);
    };
    loadHomepage();
  }, []);

  if (!homepageData) return <div className="text-center py-12">Loading...</div>;

  return (
    <main className="w-full overflow-hidden">
      {homepageData.blocks.map((block, index) => {
        switch (block.__component) {
          case 'shared.hero':
            const imgUrl = (`${baseUrl}/${block.backgroundImage.url}`)
            return (
              <section
                key={index}
                className="relative h-[90vh] flex items-center justify-center bg-black text-white"
              >
                <img
                  src={imgUrl}
                  alt={block.title}
                  className="absolute inset-0 w-full h-full object-cover opacity-70"
                />
                <div className="relative z-10 text-center px-4">
                  <h1 className="text-5xl font-bold mb-4">{block.title}</h1>
                  <p className="text-xl">{block.subtitle}</p>
                </div>
              </section>
            );

          case 'shared.feature':
            const iconUrl = (`${baseUrl}/${block.icon.url}`)
            return (
              <section key={index} className="py-16 px-6 bg-white dark:bg-gray-900">
                <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
                  <img src={iconUrl} alt={block.title} className="w-48 h-48 object-contain" />
                  <div>
                    <h2 className="text-4xl font-bold dark:text-white">{block.title}</h2>
                    <div className="text-lg text-gray-600 dark:text-gray-300 mt-4">
                      {Array.isArray(block.description)
                        ? renderRichText(block.description)
                        : block.description}
                    </div>
                  </div>
                </div>
              </section>
            );

          case 'shared.video-block': {
              const videoUrl = (`${baseUrl}${block.poster.url}`) 
            return (
              <section key={index} className="bg-black py-16 px-6 text-white text-center">
                <h2 className="text-4xl font-bold mb-6">{block.title}</h2>
                <video
                  controls
                  poster={videoUrl}
                  className="max-w-4xl mx-auto w-full rounded-xl shadow-lg"
                >
                  <source src={videoUrl} type="video/mp4" />
                </video>
              </section>
            );
          }


          case 'shared.cta':
            return (
              <section key={index} className="bg-blue-600 py-20 text-center text-white">
                <h2 className="text-4xl font-bold mb-6">{block.title}</h2>
                <a
                  href={block.buttonUrl}
                  className="inline-block bg-white text-blue-600 px-8 py-4 font-semibold rounded-full shadow-lg hover:bg-gray-100 transition"
                >
                  {block.buttonText}
                </a>
              </section>
            );

          default:
            return null;
        }
      })}
    </main>
  );
};

export default Home;
