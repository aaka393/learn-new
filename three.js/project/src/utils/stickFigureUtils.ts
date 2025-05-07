export interface StickFigure {
    x: number;
    y: number;
    targetX: number;
    scale: number;
    elasticity: number;
    swing: number;
    jumpHeight: number;
    velocity: number;
    headRadius: number;
    bodyHeight: number;
    armLength: number;
    legLength: number;
    color: string;
  }
  
  export function renderStickFigure(ctx: CanvasRenderingContext2D, figure: StickFigure) {
    const {
      x, y, swing, scale, elasticity, jumpHeight,
      headRadius, bodyHeight, armLength, legLength, color
    } = figure;
  
    // Apply jump height offset
    const adjustedY = y + jumpHeight;
    
    // Calculate elastic deformations based on velocity and swing
    const stretchFactor = 1 + Math.abs(swing) * 0.2;
    const squashFactor = Math.max(0.8, 1 - Math.abs(jumpHeight) * 0.005);
  
    // Calculate dynamic body part measurements with elasticity
    const dynamicBodyHeight = bodyHeight * (
      squashFactor + Math.sin(swing * 2) * 0.05 * elasticity
    );
    
    const dynamicArmLength = armLength * (
      1 + Math.sin(swing * 1.8) * 0.2 * elasticity
    );
    
    const dynamicLegLength = legLength * (
      1 + Math.cos(swing * 1.8) * 0.2 * elasticity
    );
  
    // Position calculations
    const armY = adjustedY + headRadius;
    const legY = adjustedY + headRadius + dynamicBodyHeight;
  
    ctx.lineWidth = 3 * scale;
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    
    // Draw shadow - shadow gets wider when jumping
    const shadowScale = 1 - Math.min(0.5, Math.abs(jumpHeight) / 100);
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(
      x, 
      y + headRadius + bodyHeight + 15, 
      30 * scale * shadowScale, 
      10 * scale * shadowScale, 
      0, 0, 2 * Math.PI
    );
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.filter = 'blur(4px)';
    ctx.fill();
    ctx.restore();
  
    // Draw head - slight squash and stretch based on jump
    ctx.beginPath();
    ctx.ellipse(
      x, 
      adjustedY, 
      headRadius * (1 / squashFactor),  // stretch horizontally when squashed
      headRadius * squashFactor,        // squash vertically
      0, 0, 2 * Math.PI
    );
    ctx.fill();
  
    // Body
    ctx.beginPath();
    ctx.moveTo(x, adjustedY + headRadius);
    ctx.lineTo(x, adjustedY + headRadius + dynamicBodyHeight);
    ctx.stroke();
  
    // Arms with elastic swing effect
    const armSwing = swing * (1 + Math.abs(figure.velocity) * 0.05);
    
    // Left arm
    ctx.beginPath();
    ctx.moveTo(x, armY);
    ctx.lineTo(
      x - Math.sin(armSwing) * dynamicArmLength, 
      armY + Math.cos(armSwing) * dynamicArmLength
    );
    ctx.stroke();
  
    // Right arm
    ctx.beginPath();
    ctx.moveTo(x, armY);
    ctx.lineTo(
      x + Math.sin(armSwing) * dynamicArmLength, 
      armY + Math.cos(armSwing) * dynamicArmLength
    );
    ctx.stroke();
  
    // Legs with elastic swing and jump effect
    const legSwing = swing * (1 + Math.abs(jumpHeight) * 0.002);
    
    // Left leg
    ctx.beginPath();
    ctx.moveTo(x, legY);
    ctx.lineTo(
      x - Math.sin(legSwing) * dynamicLegLength, 
      legY + Math.abs(Math.cos(legSwing)) * dynamicLegLength
    );
    ctx.stroke();
  
    // Right leg
    ctx.beginPath();
    ctx.moveTo(x, legY);
    ctx.lineTo(
      x + Math.sin(legSwing) * dynamicLegLength, 
      legY + Math.abs(Math.cos(legSwing)) * dynamicLegLength
    );
    ctx.stroke();
  }