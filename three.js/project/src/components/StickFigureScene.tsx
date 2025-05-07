// StickFigureScene.tsx
import React, { useEffect, useRef } from 'react';
import { AnimationController } from '../utils/AnimationController';

const StickFigureScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Make canvas responsive
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Initialize animation controller
    const controller = new AnimationController(canvas);
    const animationLoop = controller.startAnimation();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationLoop);
      controller.cleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full bg-black"
      style={{ touchAction: 'none' }}
    />
  );
};

export default StickFigureScene;
