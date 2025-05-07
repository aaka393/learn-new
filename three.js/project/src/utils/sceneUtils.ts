export function drawBackground(
    ctx: CanvasRenderingContext2D, 
    canvas: HTMLCanvasElement, 
    stars: { x: number; y: number; size: number; twinkle: number; }[]
  ) {
    // Sky gradient
    const skyGradient = ctx.createLinearGradient(0, 0, 0, canvas.height / 2);
    skyGradient.addColorStop(0, '#000510');
    skyGradient.addColorStop(1, '#0A1F3B');
    
    ctx.fillStyle = skyGradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height / 2);
    
    // Draw stars with twinkle effect
    stars.forEach(star => {
      const brightness = 0.5 + Math.abs(Math.sin(star.twinkle)) * 0.5;
      ctx.fillStyle = `rgba(255, 255, 255, ${brightness})`;
      
      // Slightly vary star size based on twinkle
      const twinkleSize = star.size * (0.8 + Math.sin(star.twinkle * 0.5) * 0.2);
      
      ctx.beginPath();
      ctx.arc(star.x, star.y, twinkleSize, 0, Math.PI * 2);
      ctx.fill();
    });
    
    // Draw moon with glow
    ctx.save();
    
    // Moon glow
    const moonX = canvas.width - 120;
    const moonY = 100;
    const moonRadius = 40;
    
    const moonGlow = ctx.createRadialGradient(
      moonX, moonY, moonRadius * 0.8,
      moonX, moonY, moonRadius * 3
    );
    moonGlow.addColorStop(0, 'rgba(200, 220, 255, 0.3)');
    moonGlow.addColorStop(1, 'rgba(200, 220, 255, 0)');
    
    ctx.fillStyle = moonGlow;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius * 3, 0, Math.PI * 2);
    ctx.fill();
    
    // Moon
    const moonGradient = ctx.createRadialGradient(
      moonX - moonRadius * 0.3, moonY - moonRadius * 0.3, 0,
      moonX, moonY, moonRadius
    );
    moonGradient.addColorStop(0, '#FFFFFF');
    moonGradient.addColorStop(0.7, '#F0F8FF');
    moonGradient.addColorStop(1, '#E6E6FA');
    
    ctx.fillStyle = moonGradient;
    ctx.beginPath();
    ctx.arc(moonX, moonY, moonRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Moon details (craters)
    ctx.fillStyle = 'rgba(200, 200, 220, 0.4)';
    ctx.beginPath();
    ctx.arc(moonX - 15, moonY - 10, 8, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(moonX + 10, moonY + 15, 6, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(moonX + 5, moonY - 15, 4, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.restore();
  }