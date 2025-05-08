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
  isSitting: boolean;
}

export function renderStickFigure(ctx: CanvasRenderingContext2D, figure: StickFigure) {
  const {
    x, y, swing, scale, elasticity, jumpHeight,
    headRadius, bodyHeight, armLength, legLength, color, isSitting
  } = figure;

  // Ensure figure is on the ground
  const groundLevel = y + headRadius + bodyHeight + legLength;
  
  // Apply jump height offset (should be 0 normally)
  const adjustedY = y - jumpHeight;
  
  ctx.lineWidth = 3 * scale;
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  
  // Draw shadow - shadow gets wider when jumping
  const shadowScale = 1 - Math.min(0.5, Math.abs(jumpHeight) / 100);
  ctx.save();
  ctx.beginPath();
  ctx.ellipse(
    x, 
    groundLevel, 
    30 * scale * shadowScale, 
    10 * scale * shadowScale, 
    0, 0, 2 * Math.PI
  );
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.filter = 'blur(4px)';
  ctx.fill();
  ctx.restore();

  if (isSitting) {
    renderSittingFigure(ctx, x, adjustedY, figure);
  } else {
    renderStandingFigure(ctx, x, adjustedY, figure);
  }
}

function renderStandingFigure(ctx: CanvasRenderingContext2D, x: number, adjustedY: number, figure: StickFigure) {
  const {
    swing, scale, elasticity, 
    headRadius, bodyHeight, armLength, legLength, color
  } = figure;
  
  // Calculate elastic deformations based on swing
  const stretchFactor = 1 + Math.abs(swing) * 0.2;
  const squashFactor = Math.max(0.8, 1 - Math.abs(figure.jumpHeight) * 0.005);

  // Calculate dynamic body part measurements with elasticity
  const dynamicBodyHeight = bodyHeight * (
    squashFactor + Math.sin(swing * 2) * 0.05 * elasticity
  );
  
  // Position calculations
  const headY = adjustedY;
  const neckY = headY + headRadius;
  const hipY = neckY + dynamicBodyHeight;

  // Draw head with slight squash and stretch
  ctx.beginPath();
  ctx.ellipse(
    x, 
    headY, 
    headRadius * (1 / squashFactor),  // stretch horizontally when squashed
    headRadius * squashFactor,        // squash vertically
    0, 0, 2 * Math.PI
  );
  ctx.fill();

  // Body (spine)
  ctx.beginPath();
  ctx.moveTo(x, neckY);
  ctx.lineTo(x, hipY);
  ctx.stroke();

  // Arms with joints (shoulders and elbows)
  const armSwing = swing * (1 + Math.abs(figure.velocity) * 0.05);
  const shoulderLength = armLength * 0.5;
  const forearmLength = armLength * 0.5;
  
  // Left arm (shoulder + elbow joint)
  const leftShoulderAngle = -Math.PI/4 + armSwing;
  const leftElbowAngle = -Math.PI/4 - armSwing * 1.5;
  
  const leftShoulderX = x - Math.sin(leftShoulderAngle) * shoulderLength;
  const leftShoulderY = neckY + Math.cos(leftShoulderAngle) * shoulderLength;
  
  // Left shoulder to elbow
  ctx.beginPath();
  ctx.moveTo(x, neckY);
  ctx.quadraticCurveTo(
    x - shoulderLength * 0.5, neckY + shoulderLength * 0.3,
    leftShoulderX, leftShoulderY
  );
  ctx.stroke();
  
  // Left elbow to hand
  const leftHandX = leftShoulderX - Math.sin(leftElbowAngle) * forearmLength;
  const leftHandY = leftShoulderY + Math.cos(leftElbowAngle) * forearmLength;
  
  ctx.beginPath();
  ctx.moveTo(leftShoulderX, leftShoulderY);
  ctx.quadraticCurveTo(
    leftShoulderX - forearmLength * 0.3, leftShoulderY + forearmLength * 0.3,
    leftHandX, leftHandY
  );
  ctx.stroke();
  
  // Right arm (shoulder + elbow joint)
  const rightShoulderAngle = Math.PI/4 - armSwing;
  const rightElbowAngle = Math.PI/4 + armSwing * 1.5;
  
  const rightShoulderX = x + Math.sin(rightShoulderAngle) * shoulderLength;
  const rightShoulderY = neckY + Math.cos(rightShoulderAngle) * shoulderLength;
  
  // Right shoulder to elbow
  ctx.beginPath();
  ctx.moveTo(x, neckY);
  ctx.quadraticCurveTo(
    x + shoulderLength * 0.5, neckY + shoulderLength * 0.3,
    rightShoulderX, rightShoulderY
  );
  ctx.stroke();
  
  // Right elbow to hand
  const rightHandX = rightShoulderX + Math.sin(rightElbowAngle) * forearmLength;
  const rightHandY = rightShoulderY + Math.cos(rightElbowAngle) * forearmLength;
  
  ctx.beginPath();
  ctx.moveTo(rightShoulderX, rightShoulderY);
  ctx.quadraticCurveTo(
    rightShoulderX + forearmLength * 0.3, rightShoulderY + forearmLength * 0.3,
    rightHandX, rightHandY
  );
  ctx.stroke();

  // Legs with joints (hips and knees)
  const legSwing = swing * (1 + Math.abs(figure.jumpHeight) * 0.002);
  const thighLength = legLength * 0.5;
  const calfLength = legLength * 0.55; // slightly longer for realism
  
  // Left leg (hip + knee joint)
  const leftHipAngle = -Math.PI/6 - legSwing;
  const leftKneeAngle = Math.PI/8 + legSwing * 2;
  
  const leftKneeX = x - Math.sin(leftHipAngle) * thighLength;
  const leftKneeY = hipY + Math.cos(leftHipAngle) * thighLength;
  
  // Left hip to knee
  ctx.beginPath();
  ctx.moveTo(x, hipY);
  ctx.quadraticCurveTo(
    x - thighLength * 0.3, hipY + thighLength * 0.2,
    leftKneeX, leftKneeY
  );
  ctx.stroke();
  
  // Left knee to foot
  const leftFootX = leftKneeX - Math.sin(leftKneeAngle) * calfLength;
  const leftFootY = leftKneeY + Math.cos(leftKneeAngle) * calfLength;
  
  ctx.beginPath();
  ctx.moveTo(leftKneeX, leftKneeY);
  ctx.quadraticCurveTo(
    leftKneeX - calfLength * 0.2, leftKneeY + calfLength * 0.4,
    leftFootX, leftFootY
  );
  ctx.stroke();
  
  // Right leg (hip + knee joint)
  const rightHipAngle = Math.PI/6 + legSwing;
  const rightKneeAngle = -Math.PI/8 - legSwing * 2;
  
  const rightKneeX = x + Math.sin(rightHipAngle) * thighLength;
  const rightKneeY = hipY + Math.cos(rightHipAngle) * thighLength;
  
  // Right hip to knee
  ctx.beginPath();
  ctx.moveTo(x, hipY);
  ctx.quadraticCurveTo(
    x + thighLength * 0.3, hipY + thighLength * 0.2,
    rightKneeX, rightKneeY
  );
  ctx.stroke();
  
  // Right knee to foot
  const rightFootX = rightKneeX + Math.sin(rightKneeAngle) * calfLength;
  const rightFootY = rightKneeY + Math.cos(rightKneeAngle) * calfLength;
  
  ctx.beginPath();
  ctx.moveTo(rightKneeX, rightKneeY);
  ctx.quadraticCurveTo(
    rightKneeX + calfLength * 0.2, rightKneeY + calfLength * 0.4,
    rightFootX, rightFootY
  );
  ctx.stroke();
}

function renderSittingFigure(ctx: CanvasRenderingContext2D, x: number, adjustedY: number, figure: StickFigure) {
  const {
    swing, scale, elasticity, 
    headRadius, bodyHeight, armLength, legLength, color
  } = figure;
  
  // Calculate body compression for breathing effect
  const breathingEffect = Math.sin(swing * 5) * 0.05 * elasticity;
  
  // Position calculations
  const headY = adjustedY;
  const neckY = headY + headRadius;
  const hipY = neckY + bodyHeight * 0.9; // Shorter torso when sitting
  
  // Ground level
  const groundLevel = hipY + legLength * 0.1; // Buttocks slightly above ground
  
  // Draw head
  ctx.beginPath();
  ctx.arc(x, headY, headRadius, 0, Math.PI * 2);
  ctx.fill();
  
  // Body (spine) with slight curve for sitting posture
  ctx.beginPath();
  ctx.moveTo(x, neckY);
  ctx.quadraticCurveTo(
    x - bodyHeight * 0.1 * breathingEffect, neckY + bodyHeight * 0.5,
    x, hipY
  );
  ctx.stroke();
  
  // Arms bent at elbows in relaxed sitting position
  const shoulderLength = armLength * 0.5;
  const forearmLength = armLength * 0.5;
  
  // Left arm (shoulder + elbow joint)
  const leftShoulderAngle = -Math.PI/4 + Math.sin(swing * 3) * 0.1;
  const leftElbowAngle = -Math.PI/3 + Math.sin(swing * 3) * 0.1;
  
  const leftShoulderX = x - Math.sin(leftShoulderAngle) * shoulderLength;
  const leftShoulderY = neckY + Math.cos(leftShoulderAngle) * shoulderLength;
  
  ctx.beginPath();
  ctx.moveTo(x, neckY);
  ctx.quadraticCurveTo(
    x - shoulderLength * 0.3, neckY + shoulderLength * 0.2,
    leftShoulderX, leftShoulderY
  );
  ctx.stroke();
  
  const leftHandX = leftShoulderX - Math.sin(leftElbowAngle) * forearmLength;
  const leftHandY = leftShoulderY + Math.cos(leftElbowAngle) * forearmLength;
  
  ctx.beginPath();
  ctx.moveTo(leftShoulderX, leftShoulderY);
  ctx.quadraticCurveTo(
    leftShoulderX - forearmLength * 0.3, leftShoulderY + forearmLength * 0.3,
    leftHandX, leftHandY
  );
  ctx.stroke();
  
  // Right arm (shoulder + elbow joint)
  const rightShoulderAngle = Math.PI/4 - Math.sin(swing * 3) * 0.1;
  const rightElbowAngle = Math.PI/3 - Math.sin(swing * 3) * 0.1;
  
  const rightShoulderX = x + Math.sin(rightShoulderAngle) * shoulderLength;
  const rightShoulderY = neckY + Math.cos(rightShoulderAngle) * shoulderLength;
  
  ctx.beginPath();
  ctx.moveTo(x, neckY);
  ctx.quadraticCurveTo(
    x + shoulderLength * 0.3, neckY + shoulderLength * 0.2,
    rightShoulderX, rightShoulderY
  );
  ctx.stroke();
  
  const rightHandX = rightShoulderX + Math.sin(rightElbowAngle) * forearmLength;
  const rightHandY = rightShoulderY + Math.cos(rightElbowAngle) * forearmLength;
  
  ctx.beginPath();
  ctx.moveTo(rightShoulderX, rightShoulderY);
  ctx.quadraticCurveTo(
    rightShoulderX + forearmLength * 0.3, rightShoulderY + forearmLength * 0.3,
    rightHandX, rightHandY
  );
  ctx.stroke();
  
  // Legs in 90-degree sitting position
  const thighLength = legLength * 0.5;
  const calfLength = legLength * 0.55;
  
  // Thighs parallel to ground, calves perpendicular (90-degree)
  
  // Left leg
  const leftKneeX = x - thighLength;
  const leftKneeY = hipY;
  
  ctx.beginPath();
  ctx.moveTo(x, hipY);
  ctx.quadraticCurveTo(
    x - thighLength * 0.5, hipY - thighLength * 0.1,
    leftKneeX, leftKneeY
  );
  ctx.stroke();
  
  const leftFootX = leftKneeX;
  const leftFootY = leftKneeY + calfLength;
  
  ctx.beginPath();
  ctx.moveTo(leftKneeX, leftKneeY);
  ctx.lineTo(leftFootX, leftFootY);
  ctx.stroke();
  
  // Right leg
  const rightKneeX = x + thighLength;
  const rightKneeY = hipY;
  
  ctx.beginPath();
  ctx.moveTo(x, hipY);
  ctx.quadraticCurveTo(
    x + thighLength * 0.5, hipY - thighLength * 0.1,
    rightKneeX, rightKneeY
  );
  ctx.stroke();
  
  const rightFootX = rightKneeX;
  const rightFootY = rightKneeY + calfLength;
  
  ctx.beginPath();
  ctx.moveTo(rightKneeX, rightKneeY);
  ctx.lineTo(rightFootX, rightFootY);
  ctx.stroke();
}