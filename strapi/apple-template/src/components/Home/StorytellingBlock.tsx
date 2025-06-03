//StorytellingBlock.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Button from '../UI/Button';

interface StorytellingBlockProps {
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage: string;
  buttonText?: string;
  buttonLink?: string;
  buttonUrl?: string;
  alignment?: 'left' | 'center' | 'right';
}

const StorytellingBlock: React.FC<StorytellingBlockProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  buttonText,
  buttonUrl,
  buttonLink = '#',
  alignment = 'center',
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const textAlignmentClass = {
    left: 'text-left items-start',
    center: 'text-center items-center',
    right: 'text-right items-end',
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.2,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  return (
    <section
      ref={ref}
      className="relative w-full min-h-[600px] overflow-hidden"
    >
      {/* Background Image */}
      <div
        className="absolute inset-0 w-full h-full bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            className={`max-w-2xl flex flex-col ${textAlignmentClass[alignment]} mx-auto md:mx-0 md:ml-${alignment === 'right' ? 'auto' : alignment === 'center' ? 'auto' : '0'}`}
            variants={containerVariants}
            initial="hidden"
            animate={inView ? "visible" : "hidden"}
          >
            {subtitle && (
              <motion.p
                variants={itemVariants}
                className="text-blue-400 font-medium mb-3"
              >
                {subtitle}
              </motion.p>
            )}

            <motion.h2
              variants={itemVariants}
              className="text-3xl md:text-4xl font-bold text-white mb-6"
            >
              {title}
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="text-lg text-gray-200 mb-8 leading-relaxed"
            >
              {description}
            </motion.p>

            {buttonText && (
              <motion.div variants={itemVariants}>
                <Button
                  variant="primary"
                  size="md"
                  href={buttonUrl}
                >
                  {buttonText}
                </Button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default StorytellingBlock;