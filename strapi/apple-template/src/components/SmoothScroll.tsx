import React, { useRef, useEffect, useState } from 'react';
import { useScroll, useTransform, motion } from 'framer-motion';

const SmoothScroll: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    if (ref.current) {
      setHeight(ref.current.offsetHeight);
    }
  }, []);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end end'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [0, -height + window.innerHeight]);

  return (
    <motion.div 
      ref={ref}
      style={{ height: `${height}px`, position: 'relative', overflow: 'hidden' }}
    >
      <motion.div 
        style={{ y, position: 'absolute', top: 0, left: 0, right: 0 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
};

export default SmoothScroll;
