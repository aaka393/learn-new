import React, { useEffect, useState } from 'react';
import { fetchHomepageData } from '../services/apiService';
import { HomepageData } from '../types/Homepage';
import Hero from '../components/sections/Hero';
import Showcase from '../components/sections/Showcase';
import Features from '../components/sections/Features';
import Story from '../components/sections/Story';

const Homepage: React.FC = () => {
  const [homepageData, setHomepageData] = useState<HomepageData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadHomepageData = async () => {
      try {
        const data = await fetchHomepageData();
        setHomepageData(data);
      } catch (err) {
        console.error('Failed to load homepage data:', err);
        setError('Failed to load homepage content. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    loadHomepageData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-blue-200 dark:border-blue-800 rounded-full animate-spin"></div>
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin absolute top-0 left-0"></div>
        </div>
      </div>
    );
  }

  if (error || !homepageData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500 bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Oops! Something went wrong</h2>
          <p>{error || 'Content not found.'}</p>
        </div>
      </div>
    );
  }

  const { hero, showcases, story, blocks } = homepageData;
  const featureBlock = blocks.find(block => block.__component === 'shared.feature');

  return (
    <main className="bg-white dark:bg-gray-900">
      {hero && (
        <Hero
          title={hero.title}
          subtitle={hero.subtitle}
          description={hero.description}
          buttonText={hero.buttonText}
          buttonLink={hero.buttonUrl}
          backgroundImage={hero.backgroundImage}
        />
      )}

      {showcases && showcases.length > 0 && showcases.map((showcase, index) => (
        <Showcase
          key={index}
          title={showcase.title}
          description={showcase.description}
          imageUrl={showcase.imageUrl}
          buttonText={showcase.buttonText}
          buttonLink={showcase.buttonLink}
          imagePosition={
            showcase.imagePosition === 'left' || showcase.imagePosition === 'right'
              ? showcase.imagePosition
              : index % 2 === 0 ? 'right' : 'left'
          }
        />
      ))}

      {featureBlock && (
        <Features
          title={featureBlock.title}
          subtitle={featureBlock.subtitle}
          features={featureBlock.features}
        />
      )}

      {story && (
        <Story
          title={story.title}
          subtitle={story.subtitle}
          description={story.description}
          backgroundImage={story.backgroundImage}
          buttonText={story.buttonText}
          buttonUrl={story.buttonUrl}
        />
      )}
    </main>
  );
};

export default Homepage;