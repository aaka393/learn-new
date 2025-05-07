import React, { useEffect, useRef } from 'react';

const StickFigureScene: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Constants
    const STAR_COUNT = 100;
    const STAR_SPEED = 1;
    const OBJECT_SPEED = 2;

    // Initial State
    const stars = Array.from({ length: STAR_COUNT }).map(() => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height / 2,
      size: Math.random() * 2 + 0.5
    }));

    const tree = {
      x: canvas.width / 4 + 300,
      y: canvas.height / 2 - 100,
      width: 20,
      height: 100
    };

    let stickX = 0;
    const targetX = canvas.width / 4;
    const stickY = canvas.height / 2 - 100;

    let startTime: number | null = null;
    let movementStopped = false;

    // Draw Functions
    const drawTree = (tree: { x: number; y: number; width: number; height: number }) => {
      // Trunk
      ctx.fillStyle = '#8B4513';
      ctx.fillRect(tree.x, tree.y, tree.width, tree.height);

      // Leaves
      ctx.beginPath();
      ctx.arc(tree.x + tree.width / 2, tree.y, 40, 0, Math.PI * 2);
      ctx.fillStyle = '#006400';
      ctx.fill();

      // Apple
      ctx.beginPath();
      ctx.arc(tree.x + tree.width / 2 + 10, tree.y + 10, 6, 0, Math.PI * 2);
      ctx.fillStyle = 'red';
      ctx.fill();

      // Stem
      ctx.beginPath();
      ctx.moveTo(tree.x + tree.width / 2 + 10, tree.y + 4);
      ctx.lineTo(tree.x + tree.width / 2 + 10, tree.y);
      ctx.strokeStyle = 'brown';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Stone under tree
      ctx.beginPath();
      ctx.ellipse(tree.x + 10, tree.y + tree.height + 20, 15, 8, 0, 0, 2 * Math.PI);
      ctx.fillStyle = '#555';
      ctx.fill();
    };

    const drawStickFigure = (x: number, y: number, swing: number) => {
      const headRadius = 15;
      const baseBodyHeight = 50;
      const armLength = 30;
      const legLength = 40;

      const bodyHeight = baseBodyHeight + Math.sin(swing) * 5;
      const elasticArm = armLength + Math.sin(swing * 1.5) * 5;
      const elasticLeg = legLength + Math.cos(swing * 1.5) * 5;

      const armY = y + headRadius + 10;
      const legY = y + headRadius + bodyHeight;

      ctx.lineWidth = 2;
      ctx.strokeStyle = '#ff6600';
      ctx.fillStyle = '#ff6600';

      // Shadow
      ctx.save();
      ctx.beginPath();
      ctx.ellipse(x, y + headRadius + bodyHeight + 10, 25, 10, 0, 0, 2 * Math.PI);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
      ctx.filter = 'blur(4px)';
      ctx.fill();
      ctx.restore();

      // Head
      ctx.beginPath();
      ctx.arc(x, y, headRadius, 0, Math.PI * 2);
      ctx.fill();

      // Body
      ctx.beginPath();
      ctx.moveTo(x, y + headRadius);
      ctx.lineTo(x, y + headRadius + bodyHeight);
      ctx.stroke();

      // Arms
      ctx.beginPath();
      ctx.moveTo(x, armY);
      ctx.lineTo(x - Math.sin(swing) * elasticArm, armY + Math.cos(swing) * elasticArm);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, armY);
      ctx.lineTo(x + Math.sin(swing) * elasticArm, armY + Math.cos(swing) * elasticArm);
      ctx.stroke();

      // Legs
      ctx.beginPath();
      ctx.moveTo(x, legY);
      ctx.lineTo(x - Math.sin(swing) * elasticLeg, legY + Math.abs(Math.cos(swing)) * elasticLeg);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(x, legY);
      ctx.lineTo(x + Math.sin(swing) * elasticLeg, legY + Math.abs(Math.cos(swing)) * elasticLeg);
      ctx.stroke();
    };

    const drawMoon = () => {
      ctx.beginPath();
      ctx.arc(canvas.width - 100, 100, 40, 0, 2 * Math.PI);
      ctx.fillStyle = '#ddddff';
      ctx.fill();
    };

    // Animation loop
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = 'black';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Moon
      drawMoon();

      // Stars
      stars.forEach(star => {
        if (!movementStopped) star.x -= STAR_SPEED;
        if (star.x < 0) {
          star.x = canvas.width;
          star.y = Math.random() * canvas.height / 2;
        }
        ctx.fillStyle = 'white';
        ctx.fillRect(star.x, star.y, star.size, star.size);
      });

      // Ground
      ctx.fillStyle = '#228B22';
      ctx.fillRect(0, canvas.height / 2, canvas.width, canvas.height / 2);

      // Tree
      if (!movementStopped) {
        tree.x -= OBJECT_SPEED;
      }
      drawTree(tree);

      // Stick Man Movement (arrives in ~3 seconds)
      if (!movementStopped) {
        const progress = Math.min(elapsed / 3000, 1); // 3 seconds to reach
        stickX = progress * targetX;
        if (progress >= 1) {
          movementStopped = true;
        }
      }

      const swing = movementStopped ? 0 : Math.sin(Date.now() / 200);
      drawStickFigure(stickX, stickY, swing);

      requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        display: 'block',
        width: '100vw',
        height: '100vh',
        background: 'black'
      }}
    />
  );
};

export default StickFigureScene;
