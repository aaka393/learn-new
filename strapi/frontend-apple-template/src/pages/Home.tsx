// Home.tsx
import React, { useEffect, useState } from 'react';
import { fetchHomepageData } from '../services/apiService';
import { HomepageData } from '../types/Homepage';
import HeroSection from '../components/Home/HeroSection';
import ProductShowcase from '../components/Home/ProductShowcase';
import FeatureGrid from '../components/Home/FeatureGrid';
import StorytellingBlock from '../components/Home/StorytellingBlock';

const Home: React.FC = () => {
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
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !homepageData) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error || 'Content not found.'}
      </div>
    );
  }
  const { hero, showcases, story, blocks } = homepageData;
  console.log(story)
  const featureBlock = blocks.find(block => block.__component === 'shared.feature');


  return (
    <main>
      {hero && (
        <HeroSection
          title={hero.title}
          subtitle={hero.subtitle}
          description={hero.description}
          buttonText={hero.buttonText}
          buttonLink={hero.buttonUrl}
          backgroundImage={hero.backgroundImage}
        />
      )}

      {showcases && showcases.length > 0 && showcases.map((showcase, index) => (
        <ProductShowcase
          key={index}
          title={showcase.title}
          description={showcase.description}
          imageUrl={showcase.imageUrl}
          buttonText={showcase.buttonText}
          imagePosition={
            showcase.imagePosition === 'left' || showcase.imagePosition === 'right'
              ? showcase.imagePosition
              : undefined
          }
        />
      ))}

      {featureBlock && (
        <FeatureGrid
          title={featureBlock.title}
          subtitle={featureBlock.subtitle}
          features={featureBlock.features}
        />
      )}

      {story && (
        <StorytellingBlock
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

export default Home;
