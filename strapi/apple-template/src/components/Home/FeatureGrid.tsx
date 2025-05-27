//FeatureGrid.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Zap, Globe, Code, Bot } from 'lucide-react';

interface Feature {
  id: number;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface FeatureGridProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
}

const FeatureGrid: React.FC<FeatureGridProps> = ({
  title = 'Our Services',
  subtitle = 'Discover what makes us different',
  features = [
    {
      id: 1,
      title: 'Web Development',
      description: 'Create stunning websites with cutting-edge technologies that engage users and drive results.',
      icon: <Code size={24} />,
    },
    {
      id: 2,
      title: 'Robotics Solutions',
      description: 'Innovative robotics applications designed to automate processes and improve efficiency.',
      icon: <Bot size={24} />,
    },
    {
      id: 3,
      title: 'Global Reach',
      description: 'Connect with customers around the world with localized and optimized digital experiences.',
      icon: <Globe size={24} />,
    },
    {
      id: 4,
      title: 'Fast Performance',
      description: 'Lightning-fast loading times and responsive designs that work on any device.',
      icon: <Zap size={24} />,
    },
  ]
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section 
      ref={ref}
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            {title}
          </motion.h2>
          
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {subtitle}
          </motion.p>
        </div>
        
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={inView ? "visible" : "hidden"}
        >
          {features.map((feature) => (
            <motion.div 
              key={feature.id}
              className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300"
              variants={itemVariants}
            >
              <div className="text-blue-500 mb-4 inline-block p-3 bg-blue-50 rounded-lg">
                {feature.icon}
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {feature.title}
              </h3>
              
              <p className="text-gray-600">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};

export default FeatureGrid;