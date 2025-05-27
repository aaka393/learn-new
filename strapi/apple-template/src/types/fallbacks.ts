// src/utils/fallbacks.ts
import { HomepageData } from '../types/Homepage';

export const fallbackHomepageData: HomepageData = {
  title: '',
  slug: '',
  seo_title: '',
  seo_description: '',
  blocks: [],
  hero: {
    title: 'Innovation that empowers',
    subtitle: 'Welcome to Yensi Solutions',
    description: 'We bring your digital vision to life with innovative web development and groundbreaking robotics solutions.',
    buttonText: 'Discover More',
    backgroundImage: 'https://images.pexels.com/photos/3861969/pexels-photo-3861969.jpeg',
  },
  showcases: [
    {
      title: 'Web Development Expertise',
      description:
        'Our team of experienced developers creates stunning, responsive websites that engage users and drive results.',
      imageUrl: 'https://images.pexels.com/photos/303383/pexels-photo-303383.jpeg',
      buttonText: 'Our Web Services',
      imagePosition: 'right',
    },
    {
      title: 'Robotics Solutions',
      description:
        "We take robotics beyond the traditional. We're dedicated to shaping the future of business with cutting-edge robotics solutions.",
      imageUrl: 'https://images.pexels.com/photos/2599244/pexels-photo-2599244.jpeg',
      buttonText: 'Explore Robotics',
      imagePosition: 'left',
    },
  ],
  story: {
    title: 'Technology meets creativity',
    subtitle: 'Our Vision',
    description:
      'At Yensi Solutions, we believe in the power of technology to transform businesses and lives.',
    backgroundImage: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    buttonText: 'About Us',
  },
};
