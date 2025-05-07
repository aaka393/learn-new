export interface Tree {
  x: number;
  y: number;
  width: number;
  height: number;
  leavesRadius: number;
}

export function renderTree(ctx: CanvasRenderingContext2D, tree: Tree) {
  const { x, y, width, height, leavesRadius } = tree;
  
  // Draw shadow
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    x + width / 2, 
    y + height + 15, 
    width * 1.5, 
    width / 2, 
    0, 0, 2 * Math.PI
  );
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.filter = 'blur(8px)';
  ctx.fill();
  ctx.restore();
  
  // Draw trunk
  const trunkGradient = ctx.createLinearGradient(x, y, x + width, y);
  trunkGradient.addColorStop(0, '#8B4513');
  trunkGradient.addColorStop(0.5, '#A05230');
  trunkGradient.addColorStop(1, '#8B4513');
  
  ctx.fillStyle = trunkGradient;
  ctx.fillRect(x, y, width, height);
  
  // Add trunk texture
  ctx.strokeStyle = '#5D2906';
  ctx.lineWidth = 1;
  
  // Add some bark lines
  for (let i = 0; i < 8; i++) {
    const lineY = y + height * (i / 8);
    const curve = Math.sin(i * 0.8) * 5;
    
    ctx.beginPath();
    ctx.moveTo(x - 2, lineY);
    ctx.bezierCurveTo(
      x + width / 3, lineY + curve,
      x + width * 2/3, lineY - curve,
      x + width + 2, lineY
    );
    ctx.stroke();
  }
  
  // Draw leaves - multi-layered for depth
  // Draw deeper leaves first
  ctx.beginPath();
  ctx.arc(x + width / 2 - 10, y + 10, leavesRadius * 0.9, 0, Math.PI * 2);
  ctx.fillStyle = '#004D00';
  ctx.fill();
  
  // Main leaves
  ctx.beginPath();
  ctx.arc(x + width / 2, y, leavesRadius, 0, Math.PI * 2);
  ctx.fillStyle = '#006400';
  ctx.fill();
  
  // Highlight leaves
  ctx.beginPath();
  ctx.arc(x + width / 2 + 15, y - 15, leavesRadius * 0.7, 0, Math.PI * 2);
  ctx.fillStyle = '#007200';
  ctx.fill();
  
  // Draw apples (3-4 randomly positioned)
  const appleCount = 3 + Math.floor(Math.random() * 2);
  for (let i = 0; i < appleCount; i++) {
    const angle = (i / appleCount) * Math.PI * 2;
    const distance = leavesRadius * 0.6;
    const appleX = x + width / 2 + Math.cos(angle) * distance;
    const appleY = y + Math.sin(angle) * distance;
    
    // Apple shadow
    ctx.beginPath();
    ctx.arc(appleX + 1, appleY + 1, 7, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
    ctx.fill();
    
    // Apple
    ctx.beginPath();
    ctx.arc(appleX, appleY, 7, 0, Math.PI * 2);
    ctx.fillStyle = '#e41e1e';
    ctx.fill();
    
    // Highlight
    ctx.beginPath();
    ctx.arc(appleX - 2, appleY - 2, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.4)';
    ctx.fill();
    
    // Stem
    ctx.beginPath();
    ctx.moveTo(appleX, appleY - 7);
    ctx.lineTo(appleX, appleY - 12);
    ctx.strokeStyle = 'brown';
    ctx.lineWidth = 1.5;
    ctx.stroke();
  }
  
  // Stone under tree
  ctx.beginPath();
  ctx.ellipse(x + width / 2 - 15, y + height + 10, 25, 10, 0, 0, 2 * Math.PI);
  ctx.fillStyle = '#555555';
  ctx.fill();
  
  // Stone highlight
  ctx.beginPath();
  ctx.ellipse(x + width / 2 - 18, y + height + 8, 10, 4, 0, 0, 2 * Math.PI);
  ctx.fillStyle = '#777777';
  ctx.fill();
}