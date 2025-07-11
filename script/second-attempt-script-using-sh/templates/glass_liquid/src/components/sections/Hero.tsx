import React from 'react';
import { motion } from 'framer-motion';
import {
  ChevronDown,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import AnimatedButton from '../ui/AnimatedButton';
import MotionDiv from '../ui/MotionDiv';

interface HeroProps {
  title: string;
  subtitle?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
  backgroundImage?: string;
}

const Hero: React.FC<HeroProps> = ({
  title,
  subtitle,
  description,
  buttonText,
  buttonLink,
  backgroundImage,
}) => {
  return (
    <section className="relative min-h-screen w-full overflow-hidden animated-bg flex items-center">
      {/* Background Image with Glass Overlay */}
      <div className="absolute inset-0">
        <motion.div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.2 }}
          transition={{ duration: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <motion.div
          className="absolute inset-0 glass-subtle"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <MotionDiv delay={0.3}>
            <div className="flex flex-col items-center justify-center gap-6 mb-12">
              {/* Title */}
              <motion.h1
                className="text-hero font-bold leading-none text-center pt-[15vh] sm:pt-0"
                initial={{ opacity: 0, y: 60 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.5 }}
              >
                {title.split(' ').map((word, index) => (
                  <motion.span
                    key={index}
                    className="inline-block mr-3 gradient-text-subtle"
                    initial={{ opacity: 0, y: 60 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.5 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                  >
                    {word}
                  </motion.span>
                ))}
              </motion.h1>
            </div>
          </MotionDiv>

          {/* Description */}
          {description && (
            <MotionDiv delay={0.8}>
              <motion.div
                className="glass-card p-8 rounded-3xl mb-16 max-w-4xl mx-auto"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <p className="text-xl md:text-2xl lg:text-3xl text-gray-700 leading-relaxed font-light">
                  {description}
                </p>
              </motion.div>
            </MotionDiv>
          )}

          {/* CTA Button */}
          {buttonText && (
            <MotionDiv delay={1}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 }}
                className="flex flex-col sm:flex-row gap-6 justify-center items-center"
              >
                <motion.a
                  href={buttonLink}
                  className="btn-primary-glass text-xl px-12 py-6 inline-flex items-center group"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="flex items-center">
                    {buttonText}
                    <ArrowRight
                      size={24}
                      className="ml-3 group-hover:translate-x-1 transition-transform"
                    />
                  </span>
                </motion.a>
              </motion.div>
            </MotionDiv>
          )}

          {/* Scroll Indicator */}
          <motion.div
            className="mb-10 mt-16 flex justify-center"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5, duration: 1 }}
          >
            <motion.div
              className="flex flex-col items-center cursor-pointer glass px-6 py-4 rounded-full group hover:glass-strong transition-all duration-300"
              animate={{ y: [0, 10, 0] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              whileHover={{ scale: 1.05 }}
            >
              <span className="text-sm mb-3 tracking-wider font-medium text-gray-600 group-hover:text-gray-800 transition-colors">
                Explore
              </span>
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
              >
                <ChevronDown size={24} className="text-gray-600" />
              </motion.div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;