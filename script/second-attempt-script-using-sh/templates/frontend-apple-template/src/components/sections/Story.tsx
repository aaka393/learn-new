import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AnimatedButton from '../ui/AnimatedButton';
import MotionDiv from '../ui/MotionDiv';

interface StoryProps {
  title: string;
  subtitle?: string;
  description: string;
  backgroundImage: string;
  buttonText?: string;
  buttonUrl?: string;
  alignment?: 'left' | 'center' | 'right';
}

const Story: React.FC<StoryProps> = ({
  title,
  subtitle,
  description,
  backgroundImage,
  buttonText,
  buttonUrl,
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

  return (
    <section
      ref={ref}
      className="relative w-full min-h-[80vh] overflow-hidden"
    >
      {/* Background */}
      <div className="absolute inset-0">
        <motion.div
          className="w-full h-full bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          initial={{ scale: 1.1 }}
          animate={inView ? { scale: 1 } : { scale: 1.1 }}
          transition={{ duration: 2, ease: [0.25, 0.46, 0.45, 0.94] }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-slate-900/90"
          initial={{ opacity: 0 }}
          animate={inView ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.5 }}
        />
      </div>

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute glass w-4 h-4 rounded-full"
            style={{
              left: `${10 + i * 12}%`,
              top: `${20 + (i % 4) * 15}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + i * 0.5,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.3,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 h-full flex items-center px-4 sm:px-6 lg:px-8 py-24">
        <div className="max-w-7xl mx-auto w-full">
          <MotionDiv
            className={`max-w-4xl flex flex-col ${textAlignmentClass[alignment]} ${
              alignment === 'center' ? 'mx-auto' : alignment === 'right' ? 'ml-auto' : ''
            }`}
            delay={0.2}
          >
            {subtitle && (
              <motion.div
                className="inline-flex items-center glass px-6 py-3 rounded-full mb-6"
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <span className="text-blue-300 font-medium tracking-wide">{subtitle}</span>
              </motion.div>
            )}

            <motion.h2
              className="text-5xl md:text-7xl font-black text-white mb-8 leading-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <span className="gradient-text">{title}</span>
            </motion.h2>

            <motion.p
              className="text-xl md:text-2xl text-slate-300 mb-12 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {description}
            </motion.p>

            {buttonText && buttonUrl && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  href={buttonUrl}
                  className="text-lg px-12 py-4 btn-glow"
                >
                  {buttonText}
                </AnimatedButton>
              </motion.div>
            )}
          </MotionDiv>
        </div>
      </div>
    </section>
  );
};

export default Story;