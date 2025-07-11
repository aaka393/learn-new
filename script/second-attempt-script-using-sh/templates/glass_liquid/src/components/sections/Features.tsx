import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { getLucideIcon } from '../../utils/getLucideIcon';
import { extractPlainText } from '../../utils/parseRichText';
import MotionDiv from '../ui/MotionDiv';

interface Feature {
  id: number;
  title: string;
  description: string | any[];
  icon?: string;
}

interface FeaturesProps {
  title?: string;
  subtitle?: string;
  features?: Feature[];
}

const Features: React.FC<FeaturesProps> = ({
  title,
  subtitle,
  features = [],
}) => {
  const [ref, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  if (!features.length) return null;

  return (
    <section
      ref={ref}
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {(title || subtitle) && (
          <div className="text-center mb-20">
            {title && (
              <MotionDiv delay={0.1}>
                <h2 className="text-5xl md:text-6xl font-bold text-gray-800 mb-6 gradient-text-subtle">
                  {title}
                </h2>
              </MotionDiv>
            )}

            {subtitle && (
              <MotionDiv delay={0.2}>
                <div className="glass-card p-8 rounded-3xl max-w-3xl mx-auto">
                  <p className="text-xl md:text-2xl text-gray-600 leading-relaxed">
                    {subtitle}
                  </p>
                </div>
              </MotionDiv>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.id}
              className="group"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
            >
              <motion.div
                className="glass-card p-8 rounded-3xl h-full hover-lift card-hover relative overflow-hidden cursor-pointer"
                whileHover={{ y: -4, scale: 1.02 }}
                transition={{ duration: 0.2 }}
              >
                {/* Gradient overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-white/10 to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-3xl"
                />

                <div className="relative z-10">
                  {feature.icon && (
                    <motion.div
                      className="text-gray-600 mb-6 inline-block p-4 rounded-2xl glass-subtle"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="glow-white">
                        {getLucideIcon(feature.icon)}
                      </div>
                    </motion.div>
                  )}

                  <h3 className="text-xl font-semibold text-gray-800 mb-4 group-hover:text-gray-900 transition-colors duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-gray-600 leading-relaxed group-hover:text-gray-700 transition-colors duration-300">
                    {typeof feature.description === 'string'
                      ? feature.description
                      : extractPlainText(feature.description)}
                  </p>
                </div>

                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border border-transparent bg-gradient-to-r from-white/20 to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.05))',
                    padding: '1px',
                    borderRadius: '1.5rem',
                  }}
                />
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;