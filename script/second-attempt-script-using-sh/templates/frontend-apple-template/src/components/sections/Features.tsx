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
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 relative overflow-hidden bg-slate-900"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="max-w-7xl mx-auto relative">
        {(title || subtitle) && (
          <div className="text-center mb-20">
            {title && (
              <MotionDiv delay={0.1}>
                <h2 className="text-5xl md:text-6xl font-black text-white mb-6 gradient-text">
                  {title}
                </h2>
              </MotionDiv>
            )}

            {subtitle && (
              <MotionDiv delay={0.2}>
                <p className="text-xl md:text-2xl text-slate-400 max-w-3xl mx-auto leading-relaxed">
                  {subtitle}
                </p>
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
                className="p-8 rounded-3xl h-full hover-lift card-hover relative overflow-hidden cursor-pointer
                  bg-slate-900/80 backdrop-blur-lg ring-1 ring-white/10"
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.3 }}
              >
                {/* Gradient overlay on hover */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />

                <div className="relative z-10">
                  {feature.icon && (
                    <motion.div
                      className="text-blue-400 mb-6 inline-block p-4 rounded-2xl
                        bg-slate-900/70 backdrop-blur-md ring-1 ring-white/20"
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      <div className="glow-blue">
                        {getLucideIcon(feature.icon)}
                      </div>
                    </motion.div>
                  )}

                  <h3 className="text-xl font-bold text-white mb-4 group-hover:gradient-text transition-all duration-300">
                    {feature.title}
                  </h3>

                  <p className="text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors duration-300">
                    {typeof feature.description === 'string'
                      ? feature.description
                      : extractPlainText(feature.description)}
                  </p>
                </div>

                {/* Animated border */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border border-transparent
                    bg-gradient-to-r from-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background:
                      'linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(147, 51, 234, 0.2))',
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
