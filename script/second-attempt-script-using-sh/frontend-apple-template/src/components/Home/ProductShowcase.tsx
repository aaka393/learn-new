import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import Button from '../UI/Button';

interface ProductShowcaseProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  imagePosition?: 'left' | 'right';
}

const ProductShowcase: React.FC<ProductShowcaseProps> = ({
  title,
  description,
  imageUrl,
  buttonText,
  buttonLink,
  imagePosition = 'right',
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const textVariants = {
    hidden: { opacity: 0, x: imagePosition === 'right' ? -30 : 30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
        staggerChildren: 0.1,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, x: imagePosition === 'right' ? 30 : -30 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  const childVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section
      ref={ref}
      className="py-16 md:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden bg-white"
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 items-center">
          {/* Image */}
          <motion.div
            className={`md:col-span-7 ${imagePosition === 'right' ? 'md:order-2' : 'md:order-1'}`}
            variants={imageVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <div className="relative overflow-hidden rounded-2xl shadow-xl">
              <img
                src={imageUrl}
                alt={title}
                className="w-full h-auto object-cover transform hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>

          {/* Text Content */}
          <motion.div
            className={`md:col-span-5 ${imagePosition === 'right' ? 'md:order-1' : 'md:order-2'}`}
            variants={textVariants}
            initial="hidden"
            animate={inView ? 'visible' : 'hidden'}
          >
            <motion.h2
              className="text-3xl md:text-4xl font-bold mb-6 text-gray-900"
              variants={childVariants}
            >
              {title}
            </motion.h2>

            <motion.p
              className="text-lg text-gray-600 mb-8 leading-relaxed"
              variants={childVariants}
            >
              {description}
            </motion.p>

            {buttonText && buttonLink && (
              <motion.div variants={childVariants}>
                <Button variant="primary" size="md" href={buttonLink}>
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

export default ProductShowcase;
