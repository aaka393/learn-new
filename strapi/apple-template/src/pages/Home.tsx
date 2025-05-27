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

  // Default fallback data if API call fails
  const fallbackData: HomepageData = {
    title: '',
    slug: '',
    seo_title: '',
    seo_description: '',
    blocks: [],
    hero: {
      title: "Innovation that empowers",
      subtitle: "Welcome to Yensi Solutions",
      description: "We bring your digital vision to life with innovative web development and groundbreaking robotics solutions.",
      buttonText: "Discover More",
      backgroundImage: "https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg"
    },
    showcases: [
      {
        title: "Web Development Expertise",
        description: "Our team of experienced developers creates stunning, responsive websites that engage users and drive results. From e-commerce platforms to corporate websites, we design and develop tailored solutions that help you stand out.",
        imageUrl: "https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg",
        buttonText: "Our Web Services",
        imagePosition: "right"
      },
      {
        title: "Robotics Solutions",
        description: "We take robotics beyond the traditional. Whether it's designing autonomous systems, building robotic applications, or automating complex workflows, we're dedicated to shaping the future of business with cutting-edge robotics solutions.",
        imageUrl: "https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg",
        buttonText: "Explore Robotics",
        imagePosition: "left"
      }
    ],
    story: {
      title: "Technology meets creativity",
      subtitle: "Our Vision",
      description: "At Yensi Solutions, we believe in the power of technology to transform businesses and lives. Our mission is to combine technological expertise with creative thinking to solve complex problems and create innovative solutions that drive growth and success.",
      backgroundImage: "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg",
      buttonText: "About Us"
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    console.warn('Using fallback data due to API error');
  }

  // Use actual data if available, otherwise use fallback
  const data = homepageData || fallbackData;

  return (
    <main>
      <HeroSection 
        title={data.hero?.title || fallbackData.hero.title}
        subtitle={data.hero?.subtitle || fallbackData.hero.subtitle}
        description={data.hero?.description || fallbackData.hero.description}
        buttonText={data.hero?.buttonText || fallbackData.hero.buttonText}
        backgroundImage={data.hero?.backgroundImage || fallbackData.hero.backgroundImage}
      />
      
      {(data.showcases || fallbackData.showcases).map((showcase, index) => (
        <ProductShowcase 
          key={index}
          title={showcase.title}
          description={showcase.description}
          imageUrl={showcase.imageUrl}
          buttonText={showcase.buttonText}
          imagePosition={index % 2 === 0 ? 'right' : 'left'}
        />
      ))}
      
      <FeatureGrid />
      
      <StorytellingBlock 
        title={data.story?.title || fallbackData.story.title}
        subtitle={data.story?.subtitle || fallbackData.story.subtitle}
        description={data.story?.description || fallbackData.story.description}
        backgroundImage={data.story?.backgroundImage || fallbackData.story.backgroundImage}
        buttonText={data.story?.buttonText || fallbackData.story.buttonText}
      />
    </main>
  );
};

export default Home;