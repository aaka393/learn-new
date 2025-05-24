import { useEffect, useRef } from 'react';

export const useParallax = (speed: number = 0.1) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const handleScroll = () => {
      const rect = element.getBoundingClientRect();
      const viewHeight = window.innerHeight;
      const scrollPercentage = (viewHeight - rect.top) / (viewHeight + rect.height);
      
      if (scrollPercentage > 0 && scrollPercentage < 1) {
        const translateY = scrollPercentage * speed * 100;
        element.style.transform = `translateY(${translateY}px)`;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed]);

  return ref;
};