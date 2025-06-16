import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import AnimatedButton from '../ui/AnimatedButton';
import HoverImage from '../ui/HoverImage';
import MotionDiv from '../ui/MotionDiv';

interface ShowcaseProps {
  title: string;
  description: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  imagePosition?: 'left' | 'right';
}

const Showcase: React.FC<ShowcaseProps> = ({
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

  return (
    <section
      ref={ref}
      className="py-24 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden relative bg-slate-900"
    >
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className={`absolute ${imagePosition === 'right' ? 'top-1/4 left-0' : 'top-1/4 right-0'} w-96 h-96 bg-blue-500/10 rounded-full blur-3xl`} />
        <div className={`absolute ${imagePosition === 'right' ? 'bottom-1/4 right-1/4' : 'bottom-1/4 left-1/4'} w-96 h-96 bg-purple-500/10 rounded-full blur-3xl`} />
      </div>

      <div className="max-w-7xl mx-auto relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          {/* Image */}
          <MotionDiv
            className={`lg:col-span-7 ${imagePosition === 'right' ? 'lg:order-2' : 'lg:order-1'}`}
            direction={imagePosition === 'right' ? 'right' : 'left'}
            delay={0.2}
          >
            <div className="relative">
              <motion.div
                className="absolute -inset-8 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-3xl blur-2xl"
                animate={inView ? { scale: [0.8, 1.1, 1] } : { scale: 0.8 }}
                transition={{ duration: 2, ease: "easeOut" }}
              />
              <motion.div
                className="relative bg-slate-900/80 backdrop-blur-lg rounded-3xl overflow-hidden cursor-pointer ring-1 ring-white/10"
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.4 }}
              >
                <HoverImage
                  src={imageUrl}
                  alt={title}
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 to-transparent" />
              </motion.div>
            </div>
          </MotionDiv>

          {/* Text Content */}
          <MotionDiv
            className={`lg:col-span-5 ${imagePosition === 'right' ? 'lg:order-1' : 'lg:order-2'}`}
            direction={imagePosition === 'right' ? 'left' : 'right'}
            delay={0.4}
          >
            <motion.h2
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-8 text-white"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="gradient-text">{title}</span>
            </motion.h2>

            <motion.p
              className="text-lg md:text-xl text-slate-400 mb-10 leading-relaxed"
              initial={{ opacity: 0, y: 30 }}
              animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ duration: 0.8, delay: 0.6 }}
            >
              {description}
            </motion.p>

            {buttonText && buttonLink && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
                transition={{ duration: 0.8, delay: 0.8 }}
              >
                <AnimatedButton
                  variant="primary"
                  size="lg"
                  href={buttonLink}
                  className="btn-glow"
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

export default Showcase;
